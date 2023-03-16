import { defineEventHandler } from 'h3';

import { createRequest, fetchResponseToServerResponse } from '../../src/fetch';
import { handleAuthRequest } from '../../src/auth-handler';

export default defineEventHandler(async (event) => {
  const request = createRequest(event.node.req);
  const authResponse = await handleAuthRequest(request);

  await fetchResponseToServerResponse(authResponse, event.node.res);
});
