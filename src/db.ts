import { v4 } from 'uuid';
import { ID, User } from './types';

export class DataBase {
  users: Map<ID, User>;
  constructor() {
    this.users = new Map();
  }

  get(id: ID) {
    return this.users.get(id) ?? null;
  }

  getAll() {
    return [...this.users.values()];
  }

  add(user: Omit<User, 'id'>) {
    const id = v4();
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  put(id: ID, user: Omit<User, 'id'>) {
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  delete(id: ID) {
    const user = this.get(id);
    this.users.delete(id);
    return user;
  }
}
