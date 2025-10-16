import { User } from '../types';

type UserForRequest = Omit<User, 'id'>;

export const isUser = (data: unknown): data is UserForRequest => {
  if (typeof data !== 'object' || data === null) return false;

  const user = data as Partial<UserForRequest>;

  return (
    typeof user.age === 'number' &&
    Array.isArray(user.hobbies) &&
    typeof user.username === 'string'
  );
};
