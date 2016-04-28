/**
Crushinator Helpers
Library of simple JS methods to produce crushed image URLs.
http://github.com/tedconf/js-crushinator-helpers
*/

'use strict';

import * as cropOption from './lib/crop-option';
import {ParamBuilder} from './lib/param-builder';
import {prepNumber} from './lib/preppers';
import {serialize} from './lib/query-string';
import {warn} from './lib/log';

/**
A list of strings and regular expressions
*/
const imageHosts = [
  'assets.tedcdn.com',
  'pb-assets.tedcdn.com',
  'pe.tedcdn.com',
  'assets2.tedcdn.com',
  'tedcdnpf-a.akamaihd.net',
  'tedcdnpa-a.akamaihd.net',
  'tedcdnpe-a.akamaihd.net',
  'images.ted.com',
  'storage.ted.com',
  'tedlive.ted.com',
  'tedlive-staging.ted.com',
  'ted2017.ted.com',
  'ted2017-staging.ted.com',
  'staging.ted.com',
  's3.amazonaws.com',
  's3-us-west-2.amazonaws.com',
  'www.filepicker.io',
  'ems.ted.com',
  'ems-staging.ted.com',
];

/**
Possible options parameters for Crushinator.
*/
const params = new ParamBuilder({
  width: { param: 'w', filter: prepNumber },
  height: { param: 'h', filter: prepNumber },
  quality: { param: 'quality', filter: prepNumber },
  crop: cropOption,
});

/**
Returns the portion of input URL that corresponds to the host name.

@private
@param {string} url
@returns {string}
*/
function extractHost(url) {
  return url.replace(/.*\/\/([^\/]+).*/, '$1');
}

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
  const parts = url.match(
    /(.+)?\/\/(?:img(?:-ssl)?\.tedcdn\.com|tedcdnpi-a\.akamaihd\.net)\/r\/([^?]+)/
  );

  // Avoid double-crushing images
  if (parts) {
    return uncrush(parts[1] + '//' + parts[2]);
  }

  return url;
}

/**
Returns a version of the image URL that uses Crushinator with the
specified options string:

    crush('http://images.ted.com/image.jpg', 'w=320')
      => 'https://tedcdnpi-a.akamaihd.net/images.ted.com/image.jpg?w=320'

@public
@param {string} url - URL of image to be optimized.
@param {Object} [options]
@param {number} [options.width] - Target image width in pixels.
@param {number} [options.height] - Target image height in pixels.
@param {number} [options.quality] - Image quality as a percentage
    (0-100).
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
export function crush(url, options={}) {
  // Avoid double-crushing the image
  url = uncrush(url);

  // Apply host whitelist
  if (!crushable(url)) {
    return url;
  }

  // Complain about use of the deprecated string API
  if (typeof options === 'string') {
    warn('Sending Crushinator options as a query string is ' +
        'deprecated. Please use the object format.');
  }

  // Stringify object options
  if (typeof options === 'object') { // or: everything is a duck
    options = serialize(Object.assign(
      params.get(options),
      options.query || {}
    ));
  }

  return 'https://tedcdnpi-a.akamaihd.net/r/' +
    url.replace(/.*\/\//, '') +
    (options ? '?' + options : '');
}

export default crush;
