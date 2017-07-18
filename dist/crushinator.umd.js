(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.crushinator = global.crushinator || {})));
}(this, (function (exports) { 'use strict';

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
Methods used by stringifyOptions to prepare Crushinator option
values.
*/

/**
Prepare a numerical value.

@param {*} value - Value that should be typecast as a number.
@returns {number}
*/
function prepNumber(value) {
  var outgoing = Number(value);

  if (!isFinite(outgoing)) {
    error$1('"' + value + '" is not a finite number');
    outgoing = 0;
  }

  return outgoing;
}

/**
ParamBuilder option for the Crushinator crop controller.
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
      gravity: 'c',
      c: prepNumber(options.width) + ',' + prepNumber(options.height)
    });
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
Convert options to a parameters object.
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
Query string helper methods
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
A list of strings and regular expressions
*/
var imageHosts = ['assets.tedcdn.com', 'pb-assets.tedcdn.com', 'pa.tedcdn.com', 'pe.tedcdn.com', 'pf.tedcdn.com', 'ph.tedcdn.com', 'pj.tedcdn.com', 'pk.tedcdn.com', 'pl.tedcdn.com', 'assets2.tedcdn.com', 'tedcdnpf-a.akamaihd.net', 'tedcdnpa-a.akamaihd.net', 'tedcdnpe-a.akamaihd.net', 'images.ted.com', 'storage.ted.com', 'tedlive.ted.com', 'tedlive-staging.ted.com', 'ted2017.ted.com', 'ted2017-staging.ted.com', 'staging.ted.com', 's3.amazonaws.com', 's3-us-west-2.amazonaws.com', 'www.filepicker.io', 'ems.ted.com', 'ems-staging.ted.com'];

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
var config = {
  host: 'https://pi.tedcdn.com'
};

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
    (0-100).
@param {boolean} [options.fit] - Will zoom and crop the image
    for best fit into the target dimensions.
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
function crush(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Avoid double-crushing the image
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

  // Stringify object options
  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    params = serialize(parameterize(options));
  }

  return config.host + '/r/' + uncrushed.replace(/.*\/\//, '') + (params ? '?' + params : '');
}

exports.config = config;
exports.crushable = crushable;
exports.uncrush = uncrush;
exports.crush = crush;
exports['default'] = crush;

Object.defineProperty(exports, '__esModule', { value: true });

})));
