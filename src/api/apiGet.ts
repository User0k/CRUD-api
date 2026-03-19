import { FastifyRequest, FastifyReply } from 'fastify';
import { dbInstance as db } from '../db';
import { RouteType } from '../types';
import { StatusCode } from '../types/enums';

export function apiGet(
  request: FastifyRequest,
  reply: FastifyReply,
  route?: RouteType,
) {
  if (!route) {
    const products = db.getAll();
    reply.status(StatusCode.OK).send(products);
    return products;
  }

  const product = db.get(route.id);

  if (!product) {
    reply
      .status(StatusCode.NotFound)
      .send({ message: 'Product with this id not found' });
    return;
  }

  reply.status(StatusCode.OK).send(product);
  return product;
}
