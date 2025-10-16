import { type IncomingMessage, type ServerResponse } from 'node:http';

import { dbInstance as db } from '../db';
import { jsonStringify } from '../utils/jsonStringify';
import { isUser } from '../utils/isUser';
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

  const user = db.get(route.id);

  if (!user) {
    res.statusCode = StatusCode.NotFound;
    res.end(jsonStringify({ message: 'User with this id not found' }));
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);

      if (!isUser(data)) {
        res.statusCode = StatusCode.Invalid;
        res.end(
          jsonStringify({
            message: 'User should have username, age and hobbies fields',
          }),
        );
        return;
      }

      db.update(user.id, data);
      res.statusCode = StatusCode.OK;
      res.end(
        jsonStringify({
          id: user.id,
          age: data.age,
          hobbies: data.hobbies,
          username: data.username,
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
