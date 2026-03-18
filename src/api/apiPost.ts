import { FastifyRequest, FastifyReply } from 'fastify';
import { isProduct } from '../utils/isProduct';
import { StatusCode } from '../types/enums';
import { dbInstance as db } from '../db';

export async function apiPost(request: FastifyRequest, reply: FastifyReply) {
  const data = request.body;

  if (!isProduct(data)) {
    reply.status(StatusCode.Invalid).send({
      message:
        'Product should have name, description, price, category, and inStock fields',
    });
    return;
  }

  const product = db.add(data);
  reply.status(StatusCode.Created).send(product);
  return product;
}
