import { FastifyRequest, FastifyReply } from 'fastify';
import { isProduct } from '../utils/isProduct';
import { RouteType } from '../types';
import { StatusCode } from '../types/enums';
import { dbInstance as db } from '../db';
import { Product } from '../types';

export async function apiPut(
  request: FastifyRequest,
  reply: FastifyReply,
  route: RouteType,
) {
  if (route.type === 'base' || route.type === 'none-id') {
    reply
      .status(StatusCode.Invalid)
      .send({ message: 'No correct UUID provided' });
    return;
  }

  const product = db.get(route.id);

  if (!product) {
    reply
      .status(StatusCode.NotFound)
      .send({ message: 'Product with this id not found' });
    return;
  }

  const data = request.body as Partial<Product>;

  if (!isProduct(data)) {
    reply.status(StatusCode.Invalid).send({
      message:
        'Product should have name, description, price, category, and inStock fields',
    });
    return;
  }

  const updatedProduct = db.update(product.id, data);
  reply.status(StatusCode.OK).send(updatedProduct);
  return updatedProduct;
}
