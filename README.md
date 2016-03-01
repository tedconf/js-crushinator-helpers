# JS Crushinator Helpers [![NPM Version](https://img.shields.io/npm/v/ted-crushinator-helpers.svg?style=flat)](https://npmjs.org/package/ted-crushinator-helpers) [![Build Status](https://travis-ci.org/tedconf/js-crushinator-helpers.svg?branch=master)](https://travis-ci.org/tedconf/js-crushinator-helpers)

JavaScript methods to produce [Crushinator](https://github.com/tedconf/crushinator)-optimized image URLs.

```javascript
crushinator.crush('http://images.ted.com/image.jpg', { width: 320 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
```

## Installation

The Crushinator helpers are distributed in [UMD](https://github.com/umdjs/umd) and have no other dependencies, so they can be imported as an AMD or as a CommonJS (Node) module. If no module system is available, the library will occupy the `crushinator` namespace in your app's global (e.g. `window.crushinator`).

### Install with NPM

```
npm install ted-crushinator-helpers
```

### Install with Bower

```
bower install ted-crushinator-helpers
```

### Manual installation

Code in `dist/crushinator.js` can be copied to your application.

## API

This library provides the following methods:

* [`crush(url, options)`](#crush) whose options can include:
	* [width](#width)
	* [height](#height)
	* [quality](#quality)
	* [crop](#crop)
* [`uncrush(url)`](#uncrush)
* [`crushable(url)`](#crushable)

### crush

Create a Crushinator-optimized image URL.

**Method signature:**

```javascript
crushinator.crush ( url , [ options = {} ] )
```

**Parameters:**

* `url` (string, required) - URL of the image you would like to be crushed.
* `options` (object, optional) - Crushinator image options as a Plain Old JavaScript Object. Available options:
	* `width` (number) - Target image width in pixels.
	* `height` (number) - Target image height in pixels.
	* `quality` (number) - Image quality as a percentage (0-100).
	* `crop` (object) - Crop configuration. (See details below.)

Example use:

```javascript
crushinator.crush('http://images.ted.com/image.jpg', { width:  320 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
```

Crushinator only operates on images hosted on whiteslisted domains. If you use the `crush` method on an image outside of that whitelist, it will simply return the original URL:

```javascript
crushinator.crush('http://celly.xxx/waffles.jpg', { width: 320 })
  // => 'http://celly.xxx/waffles.jpg'
```

This is helpful for dealing with dynamic image URLs.

#### crush options

Some more detail and examples for individual Crushinator helper options:

##### width

Number; target image width in pixels.

If the original image is wider than this value, Crushinator's version will be resized to match it.

Width and height are treated as a maximum. If width and height are both specified, Crushinator will resize the image to fit into a space of those dimensions while respecting its original aspect ratio.

If neither the width nor the height are specified, the original image dimensions will be used.

If the height is specified but not the width, the width of the resized image will respect the original aspect ratio as the image is resized by height.

Example:

```javascript
crushinator.crush('http://images.ted.com/image.jpg', { width: 320 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
```

##### height

Number; target image height in pixels.

If the original image is taller than this value, Crushinator's version will be resized to match it.

Height and width are treated as a maximum. If height and width are both specified, Crushinator will resize the image to fit into a space of those dimensions while respecting its original aspect ratio.

If neither the height nor the width are specified, the original image dimensions will be used.

If the width is specified but not the height, the height of the resized image will respect the original aspect ratio as the image is resized by width.

Example:

```javascript
crushinator.crush('http://images.ted.com/image.jpg', { height: 240 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?h=240'
```

##### quality

Number; image quality as a percentage (`0`-`100`).

If this value is omitted, a default image quality of 75% is used.

Example:

```javascript
crushinator.crush('http://images.ted.com/image.jpg', { quality: 93 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?quality=93'
```

##### crop

Crop configuration options are passed in as an object with the following properties:

* `width` (number) - Width of cropped section (in pixels).
* `height` (number) - Height of cropped section (in pixels).
* `x` (number) - Coordinate at which to start crop (pixels from left).
* `y` (number) - Coordinate at which to start crop (pixels from top).
* `afterResize` (boolean) - `true` if you want to crop the resized image rather than the original, `false` or omitted otherwise.

By default, crop configuration will be applied to the original image, which will then be resized in accord with the `height` and `width` options. The `afterResize` option allows you to configure Crushinator to instead apply the crop _after_ resizing the image.

Example:

```javascript
crushinator.crush('http://images.ted.com/image.jpg', {
    width: 640,
    height: 480,
    crop: {
      width: 200, height: 100,
      x: 50, y: 25,
      afterResize: true
    }
  })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?quality=93'
```

The above example would resize the original image to 640x480 and then take a 200x100 crop of the resized image, starting at 50x25.

### uncrush

Restore a previously crushed URL to its original form.

**Method signature:**

```javascript
crushinator.uncrush ( url )
```

**Parameters:**

* `url` (string, required) - URL of previously crushed image.

Example:

```javascript
crushinator.uncrush('https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320')
  // => 'https://images.ted.com/image.jpg'
```

### crushable

Test to see if an image URL is allowed by Crushinator's whitelist.

**Method signature:**

```javascript
crushinator.crushable ( url )
```

**Parameters:**

* `url` (string, required) - URL of image to check.

Returns `true` if the image's host is in Crushinator's whitelist, `false` otherwise.

Examples:

```javascript
crushinator.crushable('http://images.ted.com/image.jpg')
  // => true
```

```javascript
crushinator.crushable('http://celly.xxx/waffles.jpg')
  // => false
```

## Contributing

### Setup

Use [NVM](https://github.com/creationix/nvm) to make sure you have the correct Node version installed for local development.

* `git clone git@github.com:tedconf/js-crushinator-helpers.git`
* Change into the new directory
* `npm install`

### Running tests

`npm test` will lint and test the library.

### Releasing a new version

1. `npm run build` to produce a new `dist/crushinator.js`
2. Update "version" in `package.json` and commit
3. `git tag` the new semver
4. Push the master branch and new tag upstream to GitHub
5. [`npm publish`](https://docs.npmjs.com/getting-started/publishing-npm-packages) the updated node module
