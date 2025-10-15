import { baseUrl } from '../constants';
import { PathType } from '../types';

export function sanitizeUrl(url?: string): PathType | null {
  if (!url || !url.startsWith(baseUrl)) return null;
  const [, id] = url.split('/');

  if (!id) return { type: 'base' };
  return { type: 'id', id };
}
