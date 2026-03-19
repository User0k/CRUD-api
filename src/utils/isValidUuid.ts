import { validate } from 'uuid';

export function isValidUuid(id: string): boolean {
  return validate(id);
}
