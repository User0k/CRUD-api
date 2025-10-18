import { v4 } from 'uuid';
import { AppState, ID, User } from './types';

class DataBase {
  users: AppState;
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
    const { age, hobbies, username } = user;
    const newUser = { id, age, hobbies, username };
    this.users.set(id, newUser);
    return newUser;
  }

  update(id: ID, user: Omit<User, 'id'>) {
    const { age, hobbies, username } = user;
    const newUser = { id, age, hobbies, username };
    this.users.set(id, newUser);
    return newUser;
  }

  delete(id: ID) {
    const user = this.get(id);

    if (!user) return null;

    this.users.delete(id);
    return user;
  }
}

export const dbInstance = new DataBase();
