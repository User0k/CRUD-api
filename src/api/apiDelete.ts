import { FastifyReply } from 'fastify';
import { RouteType } from '../types';
import { StatusCode } from '../types/enums';
import { dbInstance as db } from '../db';

export async function apiDelete(reply: FastifyReply, route: RouteType) {
  if (route.type !== 'uuid') {
    reply.status(StatusCode.Invalid).send({ message: 'Invalid route type' });
    return;
  }

  const deletedProduct = db.delete(route.id);
  if (!deletedProduct) {
    reply
      .status(StatusCode.NotFound)
      .send({ message: 'Product with this id not found' });
    return;
  }

  reply.status(StatusCode.Deleted).send();
}
