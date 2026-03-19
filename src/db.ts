import { v4 } from 'uuid';
import { AppState, ID, Product } from './types';

class DataBase {
  products: AppState;
  constructor() {
    this.products = new Map();
  }

  get(id: ID) {
    return this.products.get(id) ?? null;
  }

  getAll() {
    return [...this.products.values()];
  }

  add(product: Omit<Product, 'id'>) {
    const id = v4();
    const { name, description, price, category, inStock } = product;
    const newProduct = { id, name, description, price, category, inStock };
    this.products.set(id, newProduct);
    return newProduct;
  }

  update(id: ID, product: Omit<Product, 'id'>) {
    const { name, description, price, category, inStock } = product;
    const newProduct = { id, name, description, price, category, inStock };
    this.products.set(id, newProduct);
    return newProduct;
  }

  delete(id: ID) {
    const product = this.get(id);

    if (!product) return null;

    this.products.delete(id);
    return product;
  }
}

export const dbInstance = new DataBase();
