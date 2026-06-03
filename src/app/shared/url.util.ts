export function idFromUrl(url: string): number {
  return Number(url.split('/').pop());
}

export function idsFromUrls(urls: string[]): number[] {
  return urls.map(idFromUrl).filter((id) => !Number.isNaN(id));
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
