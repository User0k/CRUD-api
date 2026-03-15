import { Product } from '../types';

type ProductForRequest = Omit<Product, 'id'>;

export const isProduct = (data: unknown): data is ProductForRequest => {
  if (typeof data !== 'object' || data === null) return false;

  const product = data as Partial<ProductForRequest>;

  return (
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.price === 'number' &&
    product.price > 0 &&
    typeof product.category === 'string' &&
    typeof product.inStock === 'boolean'
  );
};
