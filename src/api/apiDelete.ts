import { FastifyReply } from 'fastify';
import { RouteType } from '../types';
import { StatusCode } from '../types/enums';
import { dbInstance as db } from '../db';

export async function apiDelete(reply: FastifyReply, route: RouteType) {
  if (route.type === 'base' || route.type === 'none-id') {
    reply
      .status(StatusCode.Invalid)
      .send({ message: 'No correct UUID provided' });
    return;
  }

  const product = db.delete(route.id);

  if (!product) {
    reply
      .status(StatusCode.NotFound)
      .send({ message: 'Product with this id not found' });
    return;
  }

  reply.status(StatusCode.Deleted).send();
  return;
}
