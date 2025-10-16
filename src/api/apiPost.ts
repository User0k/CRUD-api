import { type IncomingMessage, type ServerResponse } from 'node:http';

import { dbInstance as db } from '../db';
import { jsonStringify } from '../utils/jsonStringify';
import { isUser } from '../utils/isUser';
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

      if (!isUser(data)) {
        res.statusCode = StatusCode.Invalid;
        res.end(
          jsonStringify({
            message: 'User should have username, age and hobbies fields',
          }),
        );
        return;
      }

      const user = db.add(data);
      res.statusCode = StatusCode.Created;
      res.end(jsonStringify(user));
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
