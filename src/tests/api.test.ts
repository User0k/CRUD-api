const mockV4 = jest.fn(() => {
  return 'test-uuid-' + Math.random().toString(36).slice(2, 9);
});

const mockValidate = jest.fn((id: string) => {
  if (typeof id !== 'string') return false;
  if (id.startsWith('test-uuid-')) return true;
  if (id === '00000000-0000-0000-0000-000000000000') return true;
  return false;
});

jest.mock('uuid', () => ({
  v4: mockV4,
  validate: mockValidate,
}));

import request from 'supertest';
import { apiServer } from '../api';
import { dbInstance } from '../db';
import { StatusCode } from '../types/enums';
import { Product } from '../types';

describe('Products API', () => {
  beforeAll(async () => {
    await apiServer.ready();
  });

  beforeEach(() => {
    dbInstance.products.clear();
  });

  afterAll(async () => {
    await apiServer.close();
  });

  const createProduct = async (productData: Omit<Product, 'id'>) => {
    const response = await request(apiServer.server)
      .post('/api/products')
      .send(productData);
    return response;
  };

  const validProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    category: 'Test Category',
    inStock: true,
  };

  test('should return empty array initially', async () => {
    const response = await request(apiServer.server).get('/api/products');
    expect(response.status).toBe(StatusCode.OK);
    expect(response.body).toEqual([]);
  });

  test('should create a new product', async () => {
    const response = await createProduct(validProduct);
    expect(response.status).toBe(StatusCode.Created);
    expect(response.body).toMatchObject(validProduct);
    expect(response.body).toHaveProperty('id');
  });

  test('should return the created product', async () => {
    const createResponse = await createProduct(validProduct);
    const { id } = createResponse.body;

    const getResponse = await request(apiServer.server).get(
      `/api/products/${id}`,
    );
    expect(getResponse.status).toBe(StatusCode.OK);
    expect(getResponse.body).toMatchObject(validProduct);
    expect(getResponse.body.id).toBe(id);
  });

  test('should update the product', async () => {
    const createResponse = await createProduct(validProduct);
    const { id } = createResponse.body;

    const updatedData = {
      name: 'Updated Product',
      description: 'Updated Description',
      price: 200,
      category: 'Updated Category',
      inStock: false,
    };

    const putResponse = await request(apiServer.server)
      .put(`/api/products/${id}`)
      .send(updatedData);

    expect(putResponse.status).toBe(StatusCode.OK);
    expect(putResponse.body).toMatchObject(updatedData);
    expect(putResponse.body.id).toBe(id);
  });

  test('should delete the product', async () => {
    const createResponse = await createProduct(validProduct);
    const { id } = createResponse.body;

    const deleteResponse = await request(apiServer.server).delete(
      `/api/products/${id}`,
    );
    expect(deleteResponse.status).toBe(StatusCode.Deleted);

    const getResponse = await request(apiServer.server).get(
      `/api/products/${id}`,
    );
    expect(getResponse.status).toBe(StatusCode.NotFound);
    expect(getResponse.body).toEqual({
      message: 'Product with this id not found',
    });
  });

  test('product with non-existent id should return 404', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const response = await request(apiServer.server).get(
      `/api/products/${nonExistentId}`,
    );
    expect(response.status).toBe(StatusCode.NotFound);
    expect(response.body).toEqual({
      message: 'Product with this id not found',
    });
  });

  test('product with invalid UUID should return 400', async () => {
    const invalidId = '123';
    const response = await request(apiServer.server).get(
      `/api/products/${invalidId}`,
    );
    expect(response.status).toBe(StatusCode.Invalid);
    expect(response.body).toEqual({ message: 'Invalid ID format' });
  });

  test('product with invalid data should return 400', async () => {
    const invalidProduct = { name: 'Only name' };
    const response = await request(apiServer.server)
      .post('/api/products')
      .send(invalidProduct);
    expect(response.status).toBe(StatusCode.Invalid);
    expect(response.body).toHaveProperty('message');
  });

  test('after deletion of single product the array of products should be empty', async () => {
    const createResponse = await createProduct(validProduct);
    const { id } = createResponse.body;
    await request(apiServer.server).delete(`/api/products/${id}`);

    const getResponse = await request(apiServer.server).get('/api/products');
    expect(getResponse.status).toBe(StatusCode.OK);
    expect(getResponse.body).toEqual([]);
  });
});
