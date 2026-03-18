import { FastifyRequest, FastifyReply } from 'fastify';
import { dbInstance as db } from '../db';
import { RouteType } from '../types';
import { StatusCode } from '../types/enums';

export function apiGet(
  request: FastifyRequest,
  reply: FastifyReply,
  route?: RouteType,
) {
  if (!route || route.type === 'base') {
    return db.getAll();
  }

  if (route.type === 'none-id') {
    reply
      .status(StatusCode.Invalid)
      .send({ message: 'No correct UUID provided' });
    return;
  }

  if (route.type === 'uuid') {
    const product = db.get(route.id);

    if (product) {
      return product;
    }

    reply
      .status(StatusCode.NotFound)
      .send({ message: 'Product with this id not found' });
    return;
  }
}
