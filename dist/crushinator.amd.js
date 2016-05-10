define('crushinator', ['exports'], function (exports) { 'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  /**
  True if we can send messages to the console.
  */

  var isConsolable = (typeof console === 'undefined' ? 'undefined' : babelHelpers.typeof(console)) === 'object';

  /**
  Throw an honest-to-goodness error.
  */
  function error(message) {
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
  Prepare a numerical value.

  @param {*} value - Value that should be typecast as a number.
  @returns {number}
  */
  function prepNumber(value) {
    var outgoing = Number(value);

    if (!isFinite(outgoing)) {
      error('"' + value + '" is not a finite number');
      outgoing = 0;
    }

    return outgoing;
  }

  function param(cropOptions) {
    return cropOptions.afterResize ? 'c' : 'precrop';
  }

  function filter(cropOptions) {
    var data = [];

    data.push(prepNumber(cropOptions.width));
    data.push(prepNumber(cropOptions.height));

    if (cropOptions.hasOwnProperty('x') || cropOptions.hasOwnProperty('y')) {
      data.push(prepNumber(cropOptions.x));
      data.push(prepNumber(cropOptions.y));
    }

    return data.join(',');
  }

var cropOption = Object.freeze({
    param: param,
    filter: filter
  });

  var ParamBuilder = function () {

    /**
    Constructor method.
    */

    function ParamBuilder(options) {
      babelHelpers.classCallCheck(this, ParamBuilder);

      this.options = options;
    }

    /**
    Convert values from hyphenated form to an object tree.
    */


    babelHelpers.createClass(ParamBuilder, [{
      key: 'dehyphenate',
      value: function dehyphenate(values) {
        var dehyphenated = {};

        for (var key in values) {
          if (values.hasOwnProperty(key)) {
            var value = values[key];
            var splitted = key.match(/([^-]+)-+(.*)/);

            if (splitted && this.options.hasOwnProperty(splitted[1])) {
              dehyphenated[splitted[1]] = dehyphenated[splitted[1]] || {};
              dehyphenated[splitted[1]][splitted[2]] = value;
            } else {
              dehyphenated[key] = value;
            }
          }
        }

        return dehyphenated;
      }

      /**
      Returns parameters in object form.
      */

    }, {
      key: 'get',
      value: function get(values) {
        var params = {};

        // Convert "crop-width" to crop.width etc.
        values = this.dehyphenate(values);

        for (var key in this.options) {
          if (values.hasOwnProperty(key)) {
            var model = this.options[key];
            var value = values[key];
            var param = typeof model.param === 'function' ? model.param(value) : model.param;

            params[param] = model.filter(value);
          }
        }

        return params;
      }
    }]);
    return ParamBuilder;
  }();

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

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var value = params[key];
        var param = prefix ? prefix + '[' + key + ']' : key;

        parts.push((typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object' ? serialize(value, param) : encode(param) + '=' + encode(value));
      }
    }

    return parts.join('&');
  }

  /**
  A list of strings and regular expressions
  */
  var imageHosts = ['assets.tedcdn.com', 'pb-assets.tedcdn.com', 'pe.tedcdn.com', 'assets2.tedcdn.com', 'tedcdnpf-a.akamaihd.net', 'tedcdnpa-a.akamaihd.net', 'tedcdnpe-a.akamaihd.net', 'images.ted.com', 'storage.ted.com', 'tedlive.ted.com', 'tedlive-staging.ted.com', 'ted2017.ted.com', 'ted2017-staging.ted.com', 'staging.ted.com', 's3.amazonaws.com', 's3-us-west-2.amazonaws.com', 'www.filepicker.io', 'ems.ted.com', 'ems-staging.ted.com'];

  /**
  Possible options parameters for Crushinator.
  */
  var params = new ParamBuilder({
    width: { param: 'w', filter: prepNumber },
    height: { param: 'h', filter: prepNumber },
    quality: { param: 'quality', filter: prepNumber },
    crop: cropOption
  });

  /**
  Returns the portion of input URL that corresponds to the host name.

  @private
  @param {string} url
  @returns {string}
  */
  function extractHost(url) {
    return String(url).replace(/.*\/\/([^\/]+).*/, '$1');
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
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // Avoid double-crushing the image
    url = uncrush(url);

    // Apply host whitelist
    if (!crushable(url)) {
      return url;
    }

    // Complain about use of the deprecated string API
    if (typeof options === 'string') {
      warn('Sending Crushinator options as a query string is ' + 'deprecated. Please use the object format.');
    }

    // Stringify object options
    if ((typeof options === 'undefined' ? 'undefined' : babelHelpers.typeof(options)) === 'object') {
      // or: everything is a duck
      options = serialize(Object.assign(params.get(options), options.query || {}));
    }

    return 'https://pi.tedcdn.com/r/' + url.replace(/.*\/\//, '') + (options ? '?' + options : '');
  }

  exports.crushable = crushable;
  exports.uncrush = uncrush;
  exports.crush = crush;
  exports['default'] = crush;

});