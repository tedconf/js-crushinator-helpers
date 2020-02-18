/**
Query string helper methods.
*/

/**
 * Encode value for use in a URL.
 */
export function encode(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Simple serialization of an object to query parameters.
 */
export function serialize(
  params: Record<string, any>,
  prefix?: string,
): string {
  const parts: Array<any> = [];

  Object.keys(params).forEach(key => {
    const value = params[key];
    const param = prefix ? `${prefix}[${key}]` : key;

    parts.push(
      typeof value === 'object'
        ? serialize(value, param)
        : `${encode(param)}=${encode(value)}`,
    );
  });

  return parts.join('&');
}

export default undefined;
