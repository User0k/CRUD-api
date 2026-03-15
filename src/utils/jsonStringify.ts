import { Product } from '../types';

export const jsonStringify = (
  data: Product | Product[] | { message: string },
) => JSON.stringify(data);
