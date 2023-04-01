import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import {
  CreateTRPCClientOptions,
  CreateTRPCProxyClient,
  HttpBatchLinkOptions,
  httpBatchLink as baseHttpBatchLink,
  httpLink as baseHttpLink,
  createTRPCProxyClient,
} from '@trpc/client';
import { AnyRouter } from '@trpc/server';
import {
  catchError,
  firstValueFrom,
  fromEvent,
  map,
  of,
  takeUntil,
} from 'rxjs';

export {
  CancelFn,
  CreateTRPCClientOptions,
  CreateTRPCProxyClient,
  HTTPHeaders,
  HttpBatchLinkOptions,
  LoggerLinkOptions,
  Operation,
  OperationContext,
  OperationLink,
  OperationResultEnvelope,
  OperationResultObservable,
  OperationResultObserver,
  PromiseAndCancel,
  TRPCClientError,
  TRPCClientErrorBase,
  TRPCClientErrorLike,
  TRPCClientRuntime,
  TRPCFetch,
  TRPCLink,
  TRPCRequestOptions,
  TRPCUntypedClient,
  TRPCWebSocketClient,
  WebSocketClientOptions,
  WebSocketLinkOptions,
  createTRPCProxyClient,
  createTRPCUntypedClient,
  createWSClient,
  getFetch,
  inferRouterProxyClient,
  loggerLink,
  splitLink,
  wsLink,
  TRPCClient,
  createTRPCClient,
  createTRPCClientProxy,
} from '@trpc/client';

const TRPC_CLIENT = new InjectionToken<CreateTRPCProxyClient<AnyRouter>>(
  'tRPC Client',
);

export function provideTrpcClient<TRouter extends AnyRouter>(
  options: CreateTRPCClientOptions<TRouter>,
) {
  return { provide: TRPC_CLIENT, useValue: createTRPCProxyClient(options) };
}

export function injectTrpcClient<TRouter extends AnyRouter>() {
  return inject(TRPC_CLIENT) as CreateTRPCProxyClient<TRouter>;
}

type HttpLinkOptions = Parameters<typeof baseHttpLink>[0];

export function httpLink(options: Omit<HttpLinkOptions, 'fetch'>) {
  const optionsWithFetch: HttpLinkOptions = options;

  optionsWithFetch.fetch = httpClientAsFetch;

  return baseHttpLink(optionsWithFetch);
}

export function httpBatchLink(options: Omit<HttpBatchLinkOptions, 'fetch'>) {
  const optionsWithFetch: HttpBatchLinkOptions = options;

  optionsWithFetch.fetch = httpClientAsFetch;

  return baseHttpBatchLink(optionsWithFetch);
}

function httpClientAsFetch(
  input: RequestInfo | URL | string,
  init?: RequestInit,
): Promise<Response> {
  const httpClient = inject(HttpClient);
  const request = new Request(input, init);
  let headers = new HttpHeaders();

  request.headers.forEach((value, key) => {
    headers = headers.append(key, value);
  });

  if (request.signal.aborted) {
    return Promise.reject('Aborted');
  }

  return firstValueFrom(
    httpClient
      .request(request.method, request.url, {
        headers,
        body: request.body,
        observe: 'response',
        reportProgress: false,
        responseType: 'text',
        withCredentials: request.credentials !== 'omit',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => of(error)),
        map((response) => {
          const headers = new Headers();

          for (const key of response.headers.keys()) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            for (const value of response.headers.getAll(key)!) {
              headers.append(key, value);
            }
          }

          return new Response(
            response instanceof HttpResponse ? response.body : undefined,
            {
              headers,
              status: response.status,
              statusText: response.statusText,
            },
          );
        }),
        takeUntil(fromEvent(request.signal, 'abort', { once: true })),
      ),
  );
}
