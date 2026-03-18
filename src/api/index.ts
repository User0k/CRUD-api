import fastify from 'fastify';

import { apiGet } from './apiGet';
import { apiPost } from './apiPost';
import { apiDelete } from './apiDelete';
import { apiPut } from './apiPut';
import { sanitizeUrl } from '../utils/sanitizeUrl';
import { StatusCode } from '../types/enums';

const server = fastify({
  logger: true,
});

server.get('/api/products', async (request, reply) => {
  const route = sanitizeUrl('/api/products');
  if (!route) {
    reply.status(StatusCode.NotFound).send({ message: 'Incorrect api url' });
    return;
  }

  const products = apiGet(request, reply);
  if (products !== undefined) {
    reply.status(StatusCode.OK).send(products);
  }
});

server.get('/api/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const route = sanitizeUrl(`/api/products/${id}`);

  if (!route) {
    reply.status(StatusCode.NotFound).send({ message: 'Incorrect api url' });
    return;
  }

  const product = apiGet(request, reply, route);
  if (product !== undefined) {
    reply.status(StatusCode.OK).send(product);
  }
});

server.post('/api/products', async (request, reply) => {
  const route = sanitizeUrl('/api/products');
  if (!route) {
    reply.status(StatusCode.NotFound).send({ message: 'Incorrect api url' });
    return;
  }

  await apiPost(request, reply);
});

server.put('/api/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const route = sanitizeUrl(`/api/products/${id}`);

  if (!route) {
    reply.status(StatusCode.NotFound).send({ message: 'Incorrect api url' });
    return;
  }

  await apiPut(request, reply, route);
});

server.delete('/api/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const route = sanitizeUrl(`/api/products/${id}`);

  if (!route) {
    reply.status(StatusCode.NotFound).send({ message: 'Incorrect api url' });
    return;
  }

  await apiDelete(reply, route);
});

server.setNotFoundHandler((request, reply) => {
  reply.status(StatusCode.NotFound).send({ message: 'Endpoint not found' });
});

export const apiServer = server;
export { apiDelete, apiGet, apiPost, apiPut };
