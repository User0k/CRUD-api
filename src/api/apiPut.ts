import { FastifyRequest, FastifyReply } from 'fastify';
import { validateProduct } from '../utils/validateProduct';
import { RouteType } from '../types';
import { StatusCode } from '../types/enums';
import { dbInstance as db } from '../db';

export async function apiPut(
  request: FastifyRequest,
  reply: FastifyReply,
  route: RouteType,
) {
  if (route.type !== 'uuid') {
    reply.status(StatusCode.Invalid).send({ message: 'Invalid route type' });
    return;
  }

  const product = db.get(route.id);
  if (!product) {
    reply
      .status(StatusCode.NotFound)
      .send({ message: 'Product with this id not found' });
    return;
  }

  const result = validateProduct(request.body);
  if (!result.success) {
    reply.status(StatusCode.Invalid).send({ message: result.error });
    return;
  }

  const updatedProduct = db.update(product.id, result.data);
  reply.status(StatusCode.OK).send(updatedProduct);
}
