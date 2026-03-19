import { FastifyRequest, FastifyReply } from 'fastify';
import { validateProduct } from '../utils/validateProduct';
import { StatusCode } from '../types/enums';
import { dbInstance as db } from '../db';

export async function apiPost(request: FastifyRequest, reply: FastifyReply) {
  const result = validateProduct(request.body);

  if (!result.success) {
    reply.status(StatusCode.Invalid).send({ message: result.error });
    return;
  }

  const product = db.add(result.data);
  reply.status(StatusCode.Created).send(product);
  return product;
}
