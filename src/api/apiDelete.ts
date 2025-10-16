import { type IncomingMessage, type ServerResponse } from 'node:http';

import { dbInstance as db } from '../db';
import { jsonStringify } from '../utils/jsonStringify';
import { RouteType } from '../types';
import { StatusCode } from '../types/enums';

export function apiDelete(
  res: ServerResponse<IncomingMessage>,
  route: RouteType,
) {
  if (route.type === 'base' || route.type === 'none-id') {
    res.statusCode = StatusCode.Invalid;
    res.end(jsonStringify({ message: 'No correct UUID provided' }));
    return;
  }

  const user = db.delete(route.id);

  if (!user) {
    res.statusCode = StatusCode.NotFound;
    res.end(jsonStringify({ message: 'User with this id not found' }));
    return;
  }

  res.statusCode = StatusCode.Deleted;
  res.end();
}
