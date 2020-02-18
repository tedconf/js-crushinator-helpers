/**
Crushinator Helpers
Library of simple JS methods to produce crushed image URLs.
http://github.com/tedconf/js-crushinator-helpers
*/
import { CrushConfig } from "./lib/crush-config";
/**
A whitelist: Crushinator is capable of optimizing images hosted on
any of these domains.
*/
export declare const imageHosts: string[];
/**
Global configuration options. These can be overridden at the library
level or via the options object by individual helper method calls.
*/
export declare const config: {
    defaults: boolean;
    host: string;
};
/**
 * Check to see if a URL passes Crushinator's host whitelist.
 * @param url - URL of image to check.
 * @returns is the url whitelisted?
 */
export declare function crushable(url: string): boolean;
/**
 * Restore a previously crushed URL to its original form.
 *
 * @param url - Previously optimized image URL.
 * @returns the original url
 */
export declare function uncrush(url: string): string;
/**
 * Returns a Crushinator-optimized version of an image URL, using options
 * specified in a Plain Old JavaScript Object:
 * ```
 *  crush('http://images.ted.com/image.jpg', { width: 320 })
 *    => 'https://pi.tedcdn.com/images.ted.com/image.jpg?w=320'
 * ```
 * @remarks If the input URL cannot be optimized (does not pass the whitelist) it is returned untampered, making this method safe to use for dynamic image sources.
 * @param url - URL of image to be optimized.
 * @param options - Crushinator Config
 * @returns crushed image URL
 */
export declare function crush(url: string, options?: CrushConfig): string;
export default crush;
