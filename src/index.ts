import { createServer } from 'http';

import { apiGet, apiPost, apiPut } from './api';
import { jsonStringify } from './utils/jsonStringify';
import { sanitizeUrl } from './utils/sanitizeUrl';
import { PORT } from './constants';
import { HTTPMethod, StatusCode } from './types/enums';

const server = createServer((req, res) => {
  const { method, url } = req;
  const route = sanitizeUrl(url);

  res.setHeader('Content-Type', 'application/json');

  if (!route) {
    res.statusCode = StatusCode.NotFound;
    res.end(jsonStringify({ message: 'Incorrect api url' }));
    return;
  }

  switch (method) {
    case HTTPMethod.Get:
      apiGet(res, route);
      break;
    case HTTPMethod.Post:
      apiPost(req, res);
      break;
    case HTTPMethod.Put:
      apiPut(req, res, route);
      break;
    default:
      res.statusCode = StatusCode.ServerError;
      res.end(jsonStringify({ message: 'This method is not supported' }));
      break;
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
