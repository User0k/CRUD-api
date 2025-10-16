import { type IncomingMessage, type ServerResponse } from 'node:http';

import { dbInstance as db } from '../db';
import { jsonStringify } from '../utils/jsonStringify';
import { RouteType } from '../types';
import { StatusCode } from '../types/enums';

export function apiGet(res: ServerResponse<IncomingMessage>, route: RouteType) {
  if (route.type === 'base') {
    res.statusCode = StatusCode.OK;
    res.end(jsonStringify(db.getAll()));
    return;
  }

  if (route.type === 'none-id') {
    res.statusCode = StatusCode.Invalid;
    res.end(jsonStringify({ message: 'No correct UUID provided' }));
    return;
  }

  if (route.type === 'uuid') {
    const user = db.get(route.id);

    if (user) {
      res.statusCode = StatusCode.OK;
      res.end(jsonStringify(user));
      return;
    }

    res.statusCode = StatusCode.NotFound;
    res.end(jsonStringify({ message: 'User with this id not found' }));
  }
}
