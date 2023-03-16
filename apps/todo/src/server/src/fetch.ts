import { once } from 'events';
import { IncomingMessage, ServerResponse } from 'http';
import { splitCookiesString } from 'set-cookie-parser';
import { Readable } from 'stream';
import {
  File,
  Headers,
  Request as UndiciRequest,
  Response,
  RequestInit as UndiciRequestInit,
  FormData,
} from 'undici';
import * as multipart from 'parse-multipart-data';

function nodeToWeb(incomingMessage: IncomingMessage) {
  let destroyed = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listeners: Record<string, (...args: any[]) => void> = {};

  function start(controller: ReadableStreamController<unknown>) {
    listeners['data'] = onData;
    listeners['end'] = onDestroy;
    listeners['close'] = onDestroy;
    listeners['error'] = onDestroy;

    for (const name in listeners) {
      incomingMessage.on(name, listeners[name]);
    }

    incomingMessage.pause();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onData(chunk: any) {
      if (destroyed) {
        return;
      }

      controller.enqueue(chunk);
      incomingMessage.pause();
    }

    function onDestroy(err: Error) {
      if (destroyed) {
        return;
      }

      destroyed = true;

      for (const name in listeners) {
        incomingMessage.removeListener(name, listeners[name]);
      }

      if (err) {
        controller.error(err);
      } else {
        controller.close();
      }
    }
  }

  function pull() {
    if (destroyed) return;
    incomingMessage.resume();
  }

  function cancel() {
    destroyed = true;

    for (const name in listeners) {
      incomingMessage.removeListener(name, listeners[name]);
    }

    incomingMessage.push(null);
    incomingMessage.pause();
    incomingMessage.destroy();
  }

  return new ReadableStream({ start: start, pull: pull, cancel: cancel });
}

function createHeaders(requestHeaders: IncomingMessage['headers']) {
  const headers = new Headers();

  for (const [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return headers;
}

interface RequestInit extends UndiciRequestInit {
  data?: IncomingMessage;
}

export class Request extends UndiciRequest {
  constructor(input: string, init: RequestInit) {
    if (init && init.data) {
      init = {
        duplex: 'half',
        ...init,
        body: init.data.headers['content-type']?.includes('x-www')
          ? init.data
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (nodeToWeb(init.data) as any),
      };
    }

    super(input, init);
  }

  // async json() {
  //   return JSON.parse(await this.text());
  // }

  async buffer() {
    return Buffer.from(await super.arrayBuffer());
  }

  // async text() {
  //   return (await this.buffer()).toString();
  // }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error Bad types
  override async formData() {
    if (
      this.headers.get('content-type') === 'application/x-www-form-urlencoded'
    ) {
      return await super.formData();
    } else {
      const data = await this.buffer();
      const input = multipart.parse(
        data,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.headers
          .get('content-type')!
          .replace('multipart/form-data; boundary=', ''),
      );
      const form = new FormData();

      input.forEach(({ name, data, filename, type }) => {
        // file fields have Content-Type set,
        // whereas non-file fields must not
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#multipart-form-data
        const isFile = type !== undefined;

        if (isFile) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const value = new File([data], filename!, { type });

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          form.append(name!, value, filename);
        } else {
          const value = data.toString('utf-8');

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          form.append(name!, value);
        }
      });
      return form;
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error Bad types
  override clone() {
    /** @type {BaseNodeRequest & { buffer?: () => Promise<Buffer>; formData?: () => Promise<FormData> }}  */
    const el = super.clone() as Request;

    el.buffer = this.buffer.bind(el);
    el.formData = this.formData.bind(el);
    return el;
  }
}

export function createRequest(req: IncomingMessage) {
  const origin = req.headers.origin || `http://${req.headers.host}`;
  const url = new URL(`/api${req.url ?? ''}`, origin);
  const init = {
    method: req.method,
    headers: createHeaders(req.headers),
    // POST, PUT, & PATCH will be read as body by NodeRequest
    data: req.method?.indexOf('P') === 0 ? req : undefined,
  };

  return new Request(url.href, init) as unknown as globalThis.Request;
}

export async function fetchResponseToServerResponse(
  webRes: Response,
  res: ServerResponse,
) {
  res.statusCode = webRes.status;
  res.statusMessage = webRes.statusText;

  for (const [name, value] of webRes.headers) {
    if (name === 'set-cookie') {
      res.setHeader(name, splitCookiesString(value));
    } else res.setHeader(name, value);
  }

  if (webRes.body) {
    const readable = Readable.from(webRes.body);
    readable.pipe(res);
    await once(readable, 'end');
  } else {
    res.end();
  }
}

export { splitCookiesString };
