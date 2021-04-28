/**
Crushinator Helpers
Library of simple JS methods to produce crushed image URLs.
http://github.com/tedconf/js-crushinator-helpers
*/

import { defaultify } from './lib/defaultify';
import { parameterize } from './lib/parameterize';
import { serialize } from './lib/query-string';
import { desnag } from './lib/desnag';
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
  'ideas.ted.com',
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
  'talkstar-assets.s3.amazonaws.com',
  'talkstar-photos.s3.amazonaws.com',
  'tedcdnpa-a.akamaihd.net',
  'tedcdnpe-a.akamaihd.net',
  'tedcdnpf-a.akamaihd.net',
  'tedconfblog.files.wordpress.com',
  'tedideas.files.wordpress.com',
  'tedlive.ted.com',
  'tedlive-staging.ted.com',
  'ted2017.ted.com',
  'ted2017-staging.ted.com',
  'userdata.amara.org',
  'www.filepicker.io',
  'www.ted.com',
];

/**
Global configuration options. These can be overridden at the library
level or via the options object by individual helper method calls.
*/
export const config = {
  defaults: true,
  host: 'https://pi.tedcdn.com',
};

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
Returns a Crushinator-optimized version of an image URL, using options
specified in a Plain Old JavaScript Object:

    crush('http://images.ted.com/image.jpg', { width: 320 })
      => 'https://pi.tedcdn.com/images.ted.com/image.jpg?w=320'

If the input URL cannot be optimized (does not pass the whitelist) it
is returned untampered, making this method safe to use for dynamic
image sources.

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
@param {Object|number} [options.blur] - Image blur configuration
    (object) or blur spread amount in pixels (number).
@param {number} [options.blur.sigma] - Blur spread amount in pixels.
@param {number} [options.blur.radius] - Radial constraint of blur or
    zero if unconstrained. Should be at least 2x sigma if specified.
@param {Object|number} [options.gamma] - Gamma correction, applied
    either to the whole image (number) or to individual color
    channels (object).
@param {number} [options.gamma.red] - Red channel gamma correction.
@param {number} [options.gamma.green] - Green channel gamma correction.
@param {number} [options.gamma.blue] - Blue channel gamma correction.
@param {boolean|number} [options.grayscale] - Fully desaturates the
    image if truthy. Optionally you may also darken the image by
    specifying a decimal percentage value of less than 1.
@param {Object|boolean} [options.unsharp] - Applies an unsharp mask
    if true. Precise configurations can be specified in object form:
@param {number} [options.unsharp.radius] - Number of pixels to which
    sharpening should be applied surrounding each target pixel.
@param {number} [options.unsharp.sigma] - Size of details to sharpen
    in pixels. (Pedantically: the standard deviation of the Gaussian.)
@param {number} [options.unsharp.amount] - Decimel percentage
    representing the strength of the sharpening in terms of the
    difference between the sharpened image and the original.
@param {number} [options.unsharp.threshold] - Decimal percentage
    representing a minimum amount of difference in a pixel vs
    surrounding colors before it's considered a sharpenable detail.
@param {Object} [options.query] - Additional query parameters to
    include in the Crushinator-optimized image URL.
@returns {string}
*/
export function crush(url, options = {}) {
  // Avoid double-crushing images
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

  return desnag(`${config.host}/r/${uncrushed.replace(/.*\/\//, '')}${params ? `?${params}` : ''}`);
}

export default crush;
