/**
Crushinator Helpers
Library of simple JS methods to produce crushed image URLs.
http://github.com/tedconf/js-crushinator-helpers
*/

import { defaultify } from "./lib/defaultify";
import { parameterize } from "./lib/parameterize";
import { serialize } from "./lib/query-string";
import { desnag } from "./lib/desnag";
import { CrushConfig } from "./lib/crush-config";

/**
A whitelist: Crushinator is capable of optimizing images hosted on
any of these domains.
*/
export const imageHosts = [
  "assets.tedcdn.com",
  "assets2.tedcdn.com",
  "ems.ted.com",
  "ems-staging.ted.com",
  "images.ted.com",
  "pa.tedcdn.com",
  "pb-assets.tedcdn.com",
  "pe.tedcdn.com",
  "pf.tedcdn.com",
  "ph.tedcdn.com",
  "pj.tedcdn.com",
  "pk.tedcdn.com",
  "pl.tedcdn.com",
  "s3.amazonaws.com",
  "s3-us-west-2.amazonaws.com",
  "staging.ted.com",
  "storage.ted.com",
  "talkstar-photos.s3.amazonaws.com",
  "tedcdnpa-a.akamaihd.net",
  "tedcdnpe-a.akamaihd.net",
  "tedcdnpf-a.akamaihd.net",
  "tedconfblog.files.wordpress.com",
  "tedideas.files.wordpress.com",
  "tedlive.ted.com",
  "tedlive-staging.ted.com",
  "ted2017.ted.com",
  "ted2017-staging.ted.com",
  "userdata.amara.org",
  "www.filepicker.io",
  "www.ted.com"
];

/**
Global configuration options. These can be overridden at the library
level or via the options object by individual helper method calls.
*/
export const config = {
  defaults: true,
  host: "https://pi.tedcdn.com"
};

/**
 * Returns the portion of input URL that corresponds to the host name.
 *
 * @param url - the url of the image to be crushed
 * @returns The crushed URL
 */
function extractHost(url: string): string {
  return String(url).replace(/.*\/\/([^/]+).*/, "$1");
}

/**
 * Check to see if a URL passes Crushinator's host whitelist.
 * @param url - URL of image to check.
 * @returns is the url whitelisted?
 */
export function crushable(url: string): boolean {
  return imageHosts.indexOf(extractHost(url)) !== -1;
}

/**
 * Restore a previously crushed URL to its original form.
 *
 * @param url - Previously optimized image URL.
 * @returns the original url
 */
export function uncrush(url: string): string {
  const parts = String(url).match(
    /(.+)?\/\/(?:(?:img(?:-ssl)?|pi)\.tedcdn\.com|tedcdnpi-a\.akamaihd\.net)\/r\/([^?]+)/
  );

  // Avoid double-crushing images
  if (parts) {
    return uncrush(`${parts[1]}//${parts[2]}`);
  }

  return url;
}

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
export function crush(url: string, options: CrushConfig = {}): string {
  // Avoid double-crushing images
  const uncrushed = uncrush(url);

  // Apply host whitelist
  if (!crushable(uncrushed)) {
    return uncrushed;
  }

  const params = serialize(
    parameterize(
      defaultify(Object.assign({ defaults: config.defaults }, options))
    )
  );

  return desnag(
    `${config.host}/r/${uncrushed.replace(/.*\/\//, "")}${
      params ? `?${params}` : ""
    }`
  );
}

export default crush;
