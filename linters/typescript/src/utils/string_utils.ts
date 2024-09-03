export function kebabToCamelCase(str: string, cache: Map<string, string>): string {
  if (cache.has(str)) {
    return cache.get(str)!;
  }
  const result = str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  cache.set(str, result);
  return result;
}