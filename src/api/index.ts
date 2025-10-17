import { createServer } from 'node:http';

import { apiDelete } from './apiDelete';
import { apiGet } from './apiGet';
import { apiPost } from './apiPost';
import { apiPut } from './apiPut';
import { jsonStringify } from '../utils/jsonStringify';
import { sanitizeUrl } from '../utils/sanitizeUrl';
import { StatusCode, HTTPMethod } from '../types/enums';

export const apiServer = createServer((req, res) => {
  try {
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
        apiGet(res, route!);
        break;
      case HTTPMethod.Post:
        apiPost(req, res);
        break;
      case HTTPMethod.Put:
        apiPut(req, res, route!);
        break;
      case HTTPMethod.Delete:
        apiDelete(res, route!);
        break;
      default:
        res.statusCode = StatusCode.NotFound;
        res.end(jsonStringify({ message: 'This method is not supported' }));
    }
  } catch (error) {
    console.error(error);
    res.statusCode = StatusCode.ServerError;
    res.end(
      jsonStringify({
        message: 'Internal server error',
      }),
    );
  }
});
