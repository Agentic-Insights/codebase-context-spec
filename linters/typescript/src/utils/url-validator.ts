export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export function validateUrls(obj: any): string[] {
  const errors: string[] = [];

  function traverse(obj: any, path: string[] = []) {
    if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
          if (!isValidUrl(value)) {
            errors.push(`Invalid URL at ${path.concat(key).join('.')}: ${value}`);
          }
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, path.concat(key));
        }
      }
    }
  }

  traverse(obj);
  return errors;
}