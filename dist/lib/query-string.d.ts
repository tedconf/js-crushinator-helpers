/**
Query string helper methods.
*/
/**
 * Encode value for use in a URL.
 */
export declare function encode(value: string): string;
/**
 * Simple serialization of an object to query parameters.
 */
export declare function serialize(params: Record<string, any>, prefix?: string): string;
export default undefined;
