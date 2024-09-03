import { kebabToCamelCase } from './string_utils';

describe('kebabToCamelCase', () => {
  it('should convert kebab-case to camelCase', () => {
    const cache = new Map<string, string>();
    expect(kebabToCamelCase('hello-world', cache)).toBe('helloWorld');
    expect(kebabToCamelCase('foo-bar-baz', cache)).toBe('fooBarBaz');
    expect(kebabToCamelCase('single', cache)).toBe('single');
  });

  it('should use cache for repeated conversions', () => {
    const cache = new Map<string, string>();
    const result1 = kebabToCamelCase('test-string', cache);
    const result2 = kebabToCamelCase('test-string', cache);
    
    expect(result1).toBe('testString');
    expect(result2).toBe('testString');
    expect(cache.get('test-string')).toBe('testString');
  });

  it('should handle empty string', () => {
    const cache = new Map<string, string>();
    expect(kebabToCamelCase('', cache)).toBe('');
  });

  it('should handle string with no hyphens', () => {
    const cache = new Map<string, string>();
    expect(kebabToCamelCase('alreadycamelcase', cache)).toBe('alreadycamelcase');
  });
});