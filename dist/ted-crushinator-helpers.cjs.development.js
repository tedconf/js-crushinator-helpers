'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* eslint-disable import/prefer-default-export */

/**
 * Wrapper methods for logging errors and other notices.
 */

/**
 * Throw an honest-to-goodness error.
 * @param message - A human-readable description of the error
 */
function error(message) {
  throw new Error(message);
}
/* eslint-enable import/prefer-default-export */

/**
 * Methods used to prepare Crushinator option values for parameterization,
 * mostly concerning typecasting and type-checking with application of
 * default values.
 */
/**
 * Returns true if the value is undefined, null, or false.
 * @param value - Value to test for emptiness.
 */

function isBlank(value) {
  return typeof value === 'undefined' || value === null || value === false;
}
/**
 * Prepare a boolean value.
 *
 * @param value - Value that should be typecast as a boolean.
 */

function prepBoolean(value, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = false;
  }

  return typeof value === 'undefined' ? defaultValue : !!value;
}
/**
 * Prepare a numerical value.
 * @param value - Value that should be typecast as a number.
 * @returns the resulting number
 */

function prepNumber(value, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = 0;
  }

  var outgoing = value; // Boolean true evaluates to 1 numerically

  if (value === true) {
    outgoing = defaultValue || 1;
  }

  if (isBlank(value)) {
    outgoing = defaultValue;
  } // Cast values numerically


  outgoing = Number(outgoing);

  if (!Number.isFinite(outgoing)) {
    error("\"" + value + "\" is not a finite number");
    outgoing = defaultValue;
  }

  return outgoing;
}

/**
Add defaults to a Crushinator helper options object,
unless explicitly requested not to do so.
*/
/**
 * Default Crushinator helper options.
 */

var defaultOptions = {
  fit: true,
  unsharp: true,
  quality: 82
};
/**
 * Given a list of options returns those options seeded with the defaults
 * specified above unless the "defaults" option is set to false.

 * @param options - Incoming Crushinator helper options.
 */

function defaultify(options) {
  if (options === void 0) {
    options = {
      defaults: true
    };
  }

  return Object.assign({}, prepBoolean(options.defaults, true) ? defaultOptions : {}, options);
}

/**
Given an options object, returns a parameters object with crop
parameters included according to the specified options.
*/
function param(cropOptions) {
  return cropOptions.afterResize ? 'c' : 'precrop';
}
function filter(cropOptions) {
  var data = [];
  data.push(prepNumber(cropOptions.width));
  data.push(prepNumber(cropOptions.height));

  if (Object.prototype.hasOwnProperty.call(cropOptions, 'x') || Object.prototype.hasOwnProperty.call(cropOptions, 'y')) {
    data.push(prepNumber(cropOptions.x));
    data.push(prepNumber(cropOptions.y));
  }

  return data.join(',');
}

/**
 * Given an options object, returns the parameters required to
 * resize the image for best fit if applicable.
 */
function fit(options) {
  var params = {};

  if (options.fit && options.width && options.height) {
    Object.assign(params, {
      op: '^',
      c: prepNumber(options.width) + "," + prepNumber(options.height)
    }); // A custom alignment may be specified with the fit option

    if (!options.align) params.gravity = 't';
  }

  return params;
}

/**
Given an options object, returns a parameters object with unsharp
parameters included according to the specified options.
*/
function unsharp(options) {
  var params = {};
  var value = options.unsharp;

  if (value) {
    Object.assign(params, {
      u: {
        r: prepNumber(value === null || value === void 0 ? void 0 : value.radius, 2),
        s: prepNumber(value === null || value === void 0 ? void 0 : value.sigma, 0.5),
        a: prepNumber(value === null || value === void 0 ? void 0 : value.amount, 0.8),
        t: prepNumber(value === null || value === void 0 ? void 0 : value.threshold, 0.03)
      }
    });
  }

  return params;
}

function dehyphenate(values) {
  var dehyphenated = {};
  Object.keys(values).forEach(function (key) {
    // @ts-ignore
    var value = values[key];
    var splitted = key.match(/([^-]+)-+(.*)/);

    if (splitted) {
      // @ts-ignore
      dehyphenated[splitted[1]] = dehyphenated[splitted[1]] || {}; // @ts-ignore

      dehyphenated[splitted[1]][splitted[2]] = value;
    } else {
      // @ts-ignore
      dehyphenated[key] = value;
    }
  });
  return dehyphenated;
}

/**
 * Convert helper options to Crushinator URL parameters.
 */
function parameterize(incoming) {
  var params = {};
  var options = dehyphenate(incoming);
  Object.keys(options).forEach(function (option) {
    var value = options[option];

    switch (option) {
      case 'width':
        params.w = prepNumber(value);
        break;

      case 'height':
        params.h = prepNumber(value);
        break;

      case 'quality':
        params.quality = prepNumber(value);
        break;

      case 'fit':
        Object.assign(params, fit(options));
        break;

      case 'align':
        params.gravity = // @ts-ignore
        {
          top: 'n',
          left: 'w',
          center: 'c',
          middle: 'c',
          right: 'e',
          bottom: 's'
        }[value] || 'c';
        break;

      case 'crop':
        params[param(value)] = filter(value);
        break;

      case 'blur':
        params.blur = typeof value === 'object' ? prepNumber(value.radius) + "," + prepNumber(value.sigma, 2) : "0," + prepNumber(value, 2);
        break;

      case 'gamma':
        params.gamma = typeof value === 'object' ? prepNumber(value.red, 1) + "," + prepNumber(value.green, 1) + "," + prepNumber(value.blue, 1) : prepNumber(value, 1);
        break;

      case 'grayscale':
      case 'greyscale':
        params.grayscale = prepNumber(value, 1) * 100;
        break;

      case 'unsharp':
        Object.assign(params, unsharp(options));
        break;

      case 'query':
        Object.assign(params, value || {});
        break;
    }
  });
  return params;
}

/**
Query string helper methods.
*/

/**
 * Encode value for use in a URL.
 */
function encode(value) {
  return encodeURIComponent(value);
}
/**
 * Simple serialization of an object to query parameters.
 */

function serialize(params, prefix) {
  var parts = [];
  Object.keys(params).forEach(function (key) {
    var value = params[key];
    var param = prefix ? prefix + "[" + key + "]" : key;
    parts.push(typeof value === 'object' ? serialize(value, param) : encode(param) + "=" + encode(value));
  });
  return parts.join('&');
}

/**
Crushinator Helpers
Library of simple JS methods to produce crushed image URLs.
http://github.com/tedconf/js-crushinator-helpers
*/
/**
A whitelist: Crushinator is capable of optimizing images hosted on
any of these domains.
*/

var imageHosts = ['assets.tedcdn.com', 'assets2.tedcdn.com', 'ems.ted.com', 'ems-staging.ted.com', 'images.ted.com', 'pa.tedcdn.com', 'pb-assets.tedcdn.com', 'pe.tedcdn.com', 'pf.tedcdn.com', 'ph.tedcdn.com', 'pj.tedcdn.com', 'pk.tedcdn.com', 'pl.tedcdn.com', 's3.amazonaws.com', 's3-us-west-2.amazonaws.com', 'staging.ted.com', 'storage.ted.com', 'talkstar-photos.s3.amazonaws.com', 'tedcdnpa-a.akamaihd.net', 'tedcdnpe-a.akamaihd.net', 'tedcdnpf-a.akamaihd.net', 'tedconfblog.files.wordpress.com', 'tedideas.files.wordpress.com', 'tedlive.ted.com', 'tedlive-staging.ted.com', 'ted2017.ted.com', 'ted2017-staging.ted.com', 'www.filepicker.io', 'www.ted.com'];
/**
Global configuration options. These can be overridden at the library
level or via the options object by individual helper method calls.
*/

var config = {
  defaults: true,
  host: 'https://pi.tedcdn.com'
};
/**
 * Returns the portion of input URL that corresponds to the host name.
 *
 * @param url - the url of the image to be crushed
 * @returns The crushed URL
 */

function extractHost(url) {
  return String(url).replace(/.*\/\/([^/]+).*/, '$1');
}
/**
 * Check to see if a URL passes Crushinator's host whitelist.
 * @param url - URL of image to check.
 * @returns is the url whitelisted?
 */


function crushable(url) {
  return imageHosts.indexOf(extractHost(url)) !== -1;
}
/**
 * Restore a previously crushed URL to its original form.
 *
 * @param url - Previously optimized image URL.
 * @returns the original url
 */

function uncrush(url) {
  var parts = String(url).match(/(.+)?\/\/(?:(?:img(?:-ssl)?|pi)\.tedcdn\.com|tedcdnpi-a\.akamaihd\.net)\/r\/([^?]+)/); // Avoid double-crushing images

  if (parts) {
    return uncrush(parts[1] + "//" + parts[2]);
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

function crush(url, options) {
  if (options === void 0) {
    options = {};
  }

  // Avoid double-crushing images
  var uncrushed = uncrush(url); // Apply host whitelist

  if (!crushable(uncrushed)) {
    return uncrushed;
  }

  var params = serialize(parameterize(defaultify(Object.assign({
    defaults: config.defaults
  }, options))));
  return config.host + "/r/" + uncrushed.replace(/.*\/\//, '') + (params ? "?" + params : '');
}

exports.config = config;
exports.crush = crush;
exports.crushable = crushable;
exports.default = crush;
exports.imageHosts = imageHosts;
exports.uncrush = uncrush;
//# sourceMappingURL=ted-crushinator-helpers.cjs.development.js.map
