/**
Crushinator Helpers
Library of simple JS methods to produce crushed image URLs.
http://github.com/tedconf/js-crushinator-helpers
*/

import { defaultify } from './lib/defaultify';
import { parameterize } from './lib/parameterize';
import { serialize } from './lib/query-string';
import { warn } from './lib/log';

/**
A whitelist: Crushinator is capable of optimizing images hosted on
any of these domains.
*/
export const imageHosts = [
  'assets.tedcdn.com',
  'assets2.tedcdn.com',
  'ems.ted.com',
  'ems-staging.ted.com',
  'images.ted.com',
  'pa.tedcdn.com',
  'pb-assets.tedcdn.com',
  'pe.tedcdn.com',
  'pf.tedcdn.com',
  'ph.tedcdn.com',
  'pj.tedcdn.com',
  'pk.tedcdn.com',
  'pl.tedcdn.com',
  's3.amazonaws.com',
  's3-us-west-2.amazonaws.com',
  'staging.ted.com',
  'storage.ted.com',
  'tedcdnpa-a.akamaihd.net',
  'tedcdnpe-a.akamaihd.net',
  'tedcdnpf-a.akamaihd.net',
  'tedconfblog.files.wordpress.com',
  'tedideas.files.wordpress.com',
  'tedlive.ted.com',
  'tedlive-staging.ted.com',
  'ted2017.ted.com',
  'ted2017-staging.ted.com',
  'www.filepicker.io',
  'www.ted.com',
];

/**
Returns the portion of input URL that corresponds to the host name.

@private
@param {string} url
@returns {string}
*/
function extractHost(url) {
  return String(url).replace(/.*\/\/([^/]+).*/, '$1');
}

/**
Overridable global configuration options.
*/
export const config = {
  defaults: true,
  host: 'https://pi.tedcdn.com',
};

/**
Check to see if a URL passes Crushinator's host whitelist.

@param {string} url - URL of image to check.
@returns {boolean}
*/
export function crushable(url) {
  return imageHosts.indexOf(extractHost(url)) !== -1;
}

/**
Restore a previously crushed URL to its original form.

@param {string} url - Previously optimized image URL.
@returns {string}
*/
export function uncrush(url) {
  const parts = String(url).match(/(.+)?\/\/(?:(?:img(?:-ssl)?|pi)\.tedcdn\.com|tedcdnpi-a\.akamaihd\.net)\/r\/([^?]+)/);

  // Avoid double-crushing images
  if (parts) {
    return uncrush(`${parts[1]}//${parts[2]}`);
  }

  return url;
}

/**
Returns a version of the image URL that uses Crushinator with the
specified options string:

    crush('http://images.ted.com/image.jpg', 'w=320')
      => 'https://pi.tedcdn.com/images.ted.com/image.jpg?w=320'

@public
@param {string} url - URL of image to be optimized.
@param {Object} [options]
@param {number} [options.width] - Target image width in pixels.
@param {number} [options.height] - Target image height in pixels.
@param {number} [options.quality] - Image quality as a percentage
    (0-100). Defaults to 82.
@param {boolean} [options.fit] - Will zoom and crop the image
    for best fit into the target dimensions (width and height)
    if both are provided. Defaults to true.
@param {boolean} [options.defaults] - Default options are excluded
    if set to false. Defaults to true.
@param {string} [options.align] - If cropping occurs, the image
    can be aligned to the "top", "bottom", "left", "right", or
    "middle" of the crop frame.
@param {Object} [options.crop] - Image crop configuration.
@param {number} [options.crop.width] - Width of cropped section
    in pixels.
@param {number} [options.crop.height] - Height of cropped section
    in pixels.
@param {number} [options.crop.x] - Coordinate at which to start crop
    (pixels from left.)
@param {number} [options.crop.y] - Coordinate at which to start crop
    (pixels from top.)
@param {boolean} [options.crop.afterResize] - If true, crop will
    take place after the image has been resized.
@returns {string}
*/
export function crush(url, options = {}) {
  // Avoid double-crushing the image
  const uncrushed = uncrush(url);

  // Apply host whitelist
  if (!crushable(uncrushed)) {
    return uncrushed;
  }

  let params = {};

  // Complain about use of the deprecated string API
  if (typeof options === 'string') {
    warn('Sending Crushinator options as a query string is ' +
        'deprecated. Please use the object format.');
    params = options;
  }

  // Stringify object options while adding defaults
  if (typeof options === 'object') {
    params = serialize(parameterize(defaultify(Object.assign(
      { defaults: config.defaults },
      options,
    ))));
  }

  return `${config.host}/r/${uncrushed.replace(/.*\/\//, '')}${params ? `?${params}` : ''}`;
}

export default crush;
