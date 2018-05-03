define('crushinator', ['exports'], function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
Wrapper methods for logging errors and other notices.
*/

/**
True if we can send messages to the console.
*/
var isConsolable = (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object';

/**
Throw an honest-to-goodness error.
*/
function error$1(message) {
  throw new Error(message);
}

/**
Display a warning without throwing a script-halting error.
*/
function warn(message) {
  if (isConsolable && typeof console.warn === 'function') {
    console.warn(message);
  }
}

/**
Methods used to prepare Crushinator option values for parameterization,
mostly concerning typecasting and type-checking with application of
default values.
*/

/**
Returns true if the value is undefined, null, or false.

@param {*} value - Value to test for emptiness.
@returns {boolean}
*/
function isBlank(value) {
  return typeof value === 'undefined' || value === null || value === false;
}

/**
Prepare a boolean value.

@param {*} value - Value that should be typecast as a boolean.
@returns {boolean}
*/
function prepBoolean(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return typeof value === 'undefined' ? defaultValue : !!value;
}

/**
Prepare a numerical value.

@param {*} value - Value that should be typecast as a number.
@returns {number}
*/
function prepNumber(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var outgoing = value;

  // Boolean true evaluates to 1 numerically
  if (value === true) {
    outgoing = defaultValue || 1;
  }

  if (isBlank(value)) {
    outgoing = defaultValue;
  }

  // Cast values numerically
  outgoing = Number(outgoing);

  if (!isFinite(outgoing)) {
    error$1('"' + value + '" is not a finite number');
    outgoing = defaultValue;
  }

  return outgoing;
}

/**
Add defaults to a Crushinator helper options object,
unless explicitly requested not to do so.
*/

/**
Default Crushinator helper options.
*/
var defaultOptions = {
  fit: true,
  unsharp: true,
  quality: 82
};

/**
Given a list of options returns those options seeded with the defaults
specified above unless the "defaults" option is set to false.

@param {Object} [options] - Incoming Crushinator helper options.
@returns {Object}
*/
function defaultify() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _extends({}, prepBoolean(options.defaults, true) ? defaultOptions : {}, options);
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
Given an options object, returns the parameters required to
resize the image for best fit if applicable.
*/

function fit(options) {
  var params = {};

  if (options.fit && options.width && options.height) {
    _extends(params, {
      op: '^',
      c: prepNumber(options.width) + ',' + prepNumber(options.height)
    });

    // A custom alignment may be specified with the fit option
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
    _extends(params, { u: {
        r: prepNumber(value.radius, 2),
        s: prepNumber(value.sigma, 0.5),
        a: prepNumber(value.amount, 0.8),
        t: prepNumber(value.threshold, 0.03)
      } });
  }

  return params;
}

/**
Convert values from hyphenated form to an object tree, e.g.:

```
dehyphenate({
  'cat-ears': 'pointy',
  'cat-tail': 'whippy',
  'dog-ears': 'floppy',
  'dog-tail': 'swishy',
})
// => {
//      cat: { ears: 'pointy', tail: 'whippy' },
//      dog: { ears: 'floppy', 'tail: 'swishy' },
//    }
```
*/

function dehyphenate(values) {
  var dehyphenated = {};

  Object.keys(values).forEach(function (key) {
    var value = values[key];
    var splitted = key.match(/([^-]+)-+(.*)/);

    if (splitted) {
      dehyphenated[splitted[1]] = dehyphenated[splitted[1]] || {};
      dehyphenated[splitted[1]][splitted[2]] = value;
    } else {
      dehyphenated[key] = value;
    }
  });

  return dehyphenated;
}

/**
Convert helper options to Crushinator URL parameters.
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
        _extends(params, fit(options));
        break;

      case 'align':
        params.gravity = {
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
        params.blur = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? prepNumber(value.radius) + ',' + prepNumber(value.sigma, 2) : '0,' + prepNumber(value, 2);
        break;

      case 'gamma':
        params.gamma = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? prepNumber(value.red, 1) + ',' + prepNumber(value.green, 1) + ',' + prepNumber(value.blue, 1) : prepNumber(value, 1);
        break;

      case 'grayscale':
      case 'greyscale':
        params.grayscale = prepNumber(value, 1) * 100;
        break;

      case 'unsharp':
        _extends(params, unsharp(options));
        break;

      case 'query':
        _extends(params, value || {});
        break;

      default:
        break;
    }
  });

  return params;
}

/**
Query string helper methods.
*/

/**
Encode value for use in a URL.
*/
function encode(value) {
  return encodeURIComponent(value);
}

/**
Simple serialization of an object to query parameters.
*/
function serialize(params, prefix) {
  var parts = [];

  Object.keys(params).forEach(function (key) {
    var value = params[key];
    var param = prefix ? prefix + '[' + key + ']' : key;

    parts.push((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? serialize(value, param) : encode(param) + '=' + encode(value));
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
function crushable(url) {
    return imageHosts.indexOf(extractHost(url)) !== -1;
}

/**
Restore a previously crushed URL to its original form.

@param {string} url - Previously optimized image URL.
@returns {string}
*/
function uncrush(url) {
    var parts = String(url).match(/(.+)?\/\/(?:(?:img(?:-ssl)?|pi)\.tedcdn\.com|tedcdnpi-a\.akamaihd\.net)\/r\/([^?]+)/);

    // Avoid double-crushing images
    if (parts) {
        return uncrush(parts[1] + '//' + parts[2]);
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
function crush(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // Avoid double-crushing images
    var uncrushed = uncrush(url);

    // Apply host whitelist
    if (!crushable(uncrushed)) {
        return uncrushed;
    }

    var params = {};

    // Complain about use of the deprecated string API
    if (typeof options === 'string') {
        warn('Sending Crushinator options as a query string is ' + 'deprecated. Please use the object format.');
        params = options;
    }

    // Stringify object options while adding defaults
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        params = serialize(parameterize(defaultify(_extends({ defaults: config.defaults }, options))));
    }

    return config.host + '/r/' + uncrushed.replace(/.*\/\//, '') + (params ? '?' + params : '');
}

exports.imageHosts = imageHosts;
exports.config = config;
exports.crushable = crushable;
exports.uncrush = uncrush;
exports.crush = crush;
exports['default'] = crush;

Object.defineProperty(exports, '__esModule', { value: true });

});
