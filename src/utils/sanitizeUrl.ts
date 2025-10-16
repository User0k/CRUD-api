import { validate } from 'uuid';

import { baseUrl } from '../constants';
import { RouteType } from '../types';

export function sanitizeUrl(url?: string): RouteType | null {
  if (!url || !url.startsWith(baseUrl)) return null;

  const route = url.slice(baseUrl.length);
  const [, id] = route.split('/');

  if (!id) return { type: 'base' };
  return validate(id) ? { type: 'uuid', id } : { type: 'none-id' };
}
