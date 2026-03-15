import { type IncomingMessage, type ServerResponse } from 'node:http';

import { dbInstance as db } from '../db';
import { jsonStringify } from '../utils/jsonStringify';
import { isProduct } from '../utils/isProduct';
import { RouteType } from '../types';
import { StatusCode } from '../types/enums';

export function apiPut(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  route: RouteType,
) {
  if (route.type === 'base' || route.type === 'none-id') {
    res.statusCode = StatusCode.Invalid;
    res.end(jsonStringify({ message: 'No correct UUID provided' }));
    return;
  }

  const product = db.get(route.id);

  if (!product) {
    res.statusCode = StatusCode.NotFound;
    res.end(jsonStringify({ message: 'Product with this id not found' }));
    return;
  }

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

      db.update(product.id, data);
      res.statusCode = StatusCode.OK;
      res.end(
        jsonStringify({
          id: product.id,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          inStock: data.inStock,
        }),
      );
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
