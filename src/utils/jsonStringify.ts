import { User } from '../types';

export const jsonStringify = (data: User | User[] | { message: string }) =>
  JSON.stringify(data);
