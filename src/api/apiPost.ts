import { type IncomingMessage, type ServerResponse } from 'node:http';

import { dbInstance as db } from '../db';
import { jsonStringify } from '../utils/jsonStringify';
import { isProduct } from '../utils/isProduct';
import { StatusCode } from '../types/enums';

export function apiPost(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);

      if (!isProduct(data)) {
        res.statusCode = StatusCode.Invalid;
        res.end(
          jsonStringify({
            message:
              'Product should have name, description, price, category, and inStock fields',
          }),
        );
        return;
      }

      const product = db.add(data);
      res.statusCode = StatusCode.Created;
      res.end(jsonStringify(product));
    } catch (err: unknown) {
      res.statusCode = StatusCode.ServerError;
      res.end(
        jsonStringify({
          message: 'Server cannot handle this request',
        }),
      );
      console.error(err);
    }
  });
}
