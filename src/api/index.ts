import fastify from 'fastify';

import { apiGet } from './apiGet';
import { apiPost } from './apiPost';
import { apiDelete } from './apiDelete';
import { apiPut } from './apiPut';
import { StatusCode } from '../types/enums';
import { isValidUuid } from '../utils/isValidUuid';

const server = fastify({
  ignoreTrailingSlash: true,
  logger: true,
});

server.get('/api/products', async (request, reply) => {
  const products = await apiGet(request, reply);

  if (products !== undefined) {
    reply.status(StatusCode.OK).send(products);
  }
});

server.get('/api/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  if (!isValidUuid(id)) {
    return reply
      .status(StatusCode.Invalid)
      .send({ message: 'Invalid ID format' });
  }

  const route = { type: 'uuid' as const, id };
  const product = await apiGet(request, reply, route);
  if (product !== undefined) {
    reply.status(StatusCode.OK).send(product);
  }
});

server.post('/api/products', async (request, reply) => {
  await apiPost(request, reply);
});

server.put('/api/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  if (!isValidUuid(id)) {
    return reply
      .status(StatusCode.Invalid)
      .send({ message: 'Invalid ID format' });
  }

  const route = { type: 'uuid' as const, id };
  await apiPut(request, reply, route);
});

server.delete('/api/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  if (!isValidUuid(id)) {
    return reply
      .status(StatusCode.Invalid)
      .send({ message: 'Invalid ID format' });
  }

  const route = { type: 'uuid' as const, id };
  await apiDelete(reply, route);
});

server.setNotFoundHandler((request, reply) => {
  reply.status(StatusCode.NotFound).send({ message: 'Endpoint not found' });
});

export const apiServer = server;
export { apiDelete, apiGet, apiPost, apiPut };
