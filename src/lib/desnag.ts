/**
 * Given a URL string, returns a version where parentheses and quotation
 * marks (single and double) are percent-encoded.
 *
 * Though these characters are legal in URLs, they can cause problems
 * in some interpolations. Percent encoding them avoids that pitfall.
 */

const percentifyChar = (c: string): string =>
  `%${c.charCodeAt(0).toString(16)}`;

export const desnag = (url: string): string =>
  url.replace(/[()'"]/g, percentifyChar);

export default desnag;
