/**
Crushinator Helpers
Library of simple JS methods to produce crushed image URLs.
http://github.com/tedconf/js-crushinator-helpers
*/

'use strict';

/**
A list of strings and regular expressions
*/
const imageHosts = [
  'assets.tedcdn.com',
  'pb-assets.tedcdn.com',
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
Returns the portion of input URL that corresponds to the host name.

@param {string} url
@returns {string}
*/
function extractHost(url) {
  return url.replace(/.*\/\/([^\/]+).*/, '$1');
}

/**
Check to see if a URL passes Crushinator's host whitelist.

@param {string} url
@returns {boolean}
*/
export function crushable(url) {
  return imageHosts.indexOf(extractHost(url)) !== -1;
}

/**
Restore a previously crushed URL to its original form.

@param {string} url
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
@param {string} url
@param {string} options
@returns {string}
*/
export function crush(url, options) {
  // Avoid double-crushing the image
  url = uncrush(url);

  // Apply host whitelist
  if (!crushable(url)) {
    return url;
  }

  return 'https://tedcdnpi-a.akamaihd.net/r/' +
    url.replace(/.*\/\//, '') +
    (options ? '?' + options : '');
}

export default crush;
