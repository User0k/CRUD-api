import { Product } from '../types';

type ProductForRequest = Omit<Product, 'id'>;

type ValidationResult =
  | { success: true; data: ProductForRequest }
  | { success: false; error: string };

export function validateProduct(data: unknown): ValidationResult {
  if (typeof data !== 'object' || data === null) {
    return {
      success: false,
      error: 'Request body must be a valid JSON object',
    };
  }

  const product = data as Partial<ProductForRequest>;

  if (typeof product.name !== 'string') {
    return { success: false, error: 'Name must be a string' };
  }
  if (typeof product.description !== 'string') {
    return { success: false, error: 'Description must be a string' };
  }
  if (typeof product.price !== 'number' || product.price <= 0) {
    return { success: false, error: 'Price must be a positive number' };
  }
  if (typeof product.category !== 'string') {
    return { success: false, error: 'Category must be a string' };
  }
  if (typeof product.inStock !== 'boolean') {
    return { success: false, error: 'inStock must be a boolean' };
  }

  return {
    success: true,
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      inStock: product.inStock,
    },
  };
}
