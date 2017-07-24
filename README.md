# JS Crushinator Helpers [![NPM Version](https://img.shields.io/npm/v/ted-crushinator-helpers.svg?style=flat)](https://npmjs.org/package/ted-crushinator-helpers) [![Build Status](https://travis-ci.org/tedconf/js-crushinator-helpers.svg?branch=master)](https://travis-ci.org/tedconf/js-crushinator-helpers)

JavaScript helper methods to create [Crushinator-optimized](https://github.com/tedconf/crushinator) image URLs:

```javascript
crushinator.crush('https://images.ted.com/image.jpg', { width: 320, height: 180, fit: true })
  // => 'https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=320&h=180&op=^&gravity=c&crop=320,180,0,0'
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for contributors' instructions.

## Install
```
npm install --save ted-crushinator-helpers
```

Where NPM is unavailable, [`dist/crushinator.umd.min.js`](dist/crushinator.umd.min.js) can be copied directly to your application.

## API
This library provides the following helper methods:

* [`crush(url, options)`](#crush) for optimizing images. This is probably all you need.
* [`crushable(url)`](#crushable) to determine whether an image can be optimized.
* [`uncrush(url)`](#uncrush) for de-optimizing images.

Here are descriptions and examples for each of these methods:

### crush
Returns a Crushinator-optimized version of an image URL, using options specified in a plain object.

```javascript
crushinator.crush ( url , { …options } )
```

Example:

```javascript
crushinator.crush('https://images.ted.com/image.jpg', { width: 320 })
  // => 'https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=320'
```

If the image URL cannot be optimized (does not pass the whitelist) it's returned untampered, making this method safe to use for dynamic image sources.

Available options:

| Option | Description of typical use | Example value
| :----- | :------------------------- | :------------
| [`width`](#width) | Number. Target image width in pixels. | `width: 320`
| [`height`](#height) | Number. Target image height in pixels. | `height: 180`
| [`quality`](#quality) | Number. Image quality as a percentage (0-100). Defaults to 82. | `quality: 74`
| [`fit`](#fit) | Boolean. True to zoom and crop the image for best fit into the target dimensions (width and height) if both are provided. Enabled by default. | `fit: true`
| [`defaults`](#defaults) | Boolean. False to disable the default options added by the helper. | `defaults: false`
| [`crop`](#crop) | Object. An image crop configuration specifying the dimensions and coordinates of the section to crop. | `crop: { width: 200, height: 100, x: 50, y: 50 }`
| [`align`](#align) | String. When cropping an image, it can be aligned to the "top", "bottom", "left", "right", or "middle" of the crop frame. | `align: 'top'`
| [`blur`](#blur) | Number. A blur spread amount in pixels. | `blur: 4`
| [`gamma`](#gamma) | Number. A gamma correction multiplier. Values less than 1.0 darken the image, and values greater than 1.0 lighten it. | `gamma: 1.4`
| [`grayscale`](#grayscale) | Boolean. Fully desaturates the image. | `grayscale: true`
| [`unsharp`](#unsharp) | Boolean. Applies an unsharp mask to accentuate image details. Enabled by default. | `unsharp: true`
| [`query`](#query) | Object. Additional query parameters to include in the Crushinator-optimized image URL. | `query: { cb: 1337 }`

### crushable
Returns `true` if an image URL passes Crushinator's host whitelist, `false` otherwise.

```javascript
crushinator.crushable ( url )
```

Example:

```javascript
crushinator.crushable('https://images.ted.com/image.jpg')
  // => true
```

### uncrush
Restores a Crushinator-optimized image URL to its original form.

```javascript
crushinator.uncrush ( url )
```

Example:

```javascript
crushinator.uncrush('https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=320')
  // => 'https://images.ted.com/image.jpg'
```

## Crush options
This section provides some additional detail for the [`crush`](#crush) method's options.

### width
Number. Target image width in pixels.

If width and height are both specified and the [`fit`](#fit) option is enabled (which it is by default), then the image will be zoomed and cropped to match the requested dimensions.

If width and height are both specified and the `fit` option is _disabled,_ the image will be resized to fit into a space of the target dimensions while respecting its original aspect ratio.

Otherwise, if only the width is specified and the original image is wider than the specified width, then the image will be resized to the target width and its height will be calculated according to the original image's aspect ratio.

Example:

```javascript
crushinator.crush('https://images.ted.com/image.jpg', { width: 320 })
  // => 'https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=320'
```

### height
Number. Target image height in pixels.

If height and width are both specified and the [`fit`](#fit) option is enabled (which it is by default), then the image will be zoomed and cropped to match the requested dimensions.

If height and width are both specified and the `fit` option is _disabled,_ the image will be resized to fit into a space of the target dimensions while respecting its original aspect ratio.

Otherwise, if only the height is specified and the original image is taller than the specified height, then the image will be resized to the target height and its width will be calculated according to the original image's aspect ratio.

Example:

```javascript
crushinator.crush('https://images.ted.com/image.jpg', { height: 240 })
  // => 'https://pi.tedcdn.com/r/images.ted.com/image.jpg?h=240'
```

### quality
Number. Image quality as a percentage (`0`-`100`).

If this value is omitted, a default image quality of 82% is used.

Example:

```javascript
crushinator.crush('https://images.ted.com/image.jpg', { quality: 93 })
  // => 'https://pi.tedcdn.com/r/images.ted.com/image.jpg?quality=93'
```

### fit
Boolean. Shorthand which, when enabled, results in "best fit" (or "zoom and crop") resizing if the output width and height are both specified.

It is enabled (true) by default, and can be disabled by setting to false:

```
crushinator.crush('https://images.ted.com/image.jpg', {
  width: 320,
  height: 240,
  fit: false,
})
```

### defaults
(TBD)

### crop
Object. Crop configuration options are passed in as an object with the following properties:

* `width` - Number. Width of the cropped section in pixels.
* `height` - Number. Height of the cropped section in pixels.
* `x` - Number. Coordinate at which to start crop (pixels from left).
* `y` - Number. Coordinate at which to start crop (pixels from top).
* `afterResize` - Boolean. `true` if you want to crop the resized image rather than the original; omitted otherwise.

By default, crop configuration will be applied to the original image, which will then be resized in accord with the [`height`](#height) and [`width`](#width) options. The `afterResize` option allows you to configure Crushinator to instead apply the crop _after_ resizing the image.

Example:

```javascript
crushinator.crush('https://images.ted.com/image.jpg', {
    width: 640,
    height: 480,
    crop: {
      width: 200, height: 100,
      x: 50, y: 25,
      afterResize: true
    },
  })
  // => 'https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=640&h=480&c=200%2C100%2C50%2C25'
```

The above example would resize the original image to 640x480 and then take a 200x100 crop of the resized image, starting at 50x25.

Crop configuration options can also be sent in hyphenated form:

```javascript
crushinator.crush('https://images.ted.com/image.jpg', {
    width: 640,
    height: 480,
    'crop-width': 200, 'crop-height': 100,
    'crop-x': 50, 'crop-y': 25,
    'crop-afterResize': true
  })
  // => 'https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=640&h=480&c=200%2C100%2C50%2C25'
```

### align
(TBD)

### blur
(TBD)

### gamma
(TBD)

### grayscale
(TBD)

### unsharp
(TBD)

### query
Object. For specifying additional query parameters to include in the Crushinator-optimized image URL:

```javascript
crushinator.crush('https://images.ted.com/image.jpg', {
    width: 200,
    query: { cb: 1337 }
  })
  // => 'https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=200&cb=1337'
```

This allows you to directly apply [any of Crushinator's query parameters](https://github.com/tedconf/crushinator) instead of using this helper's options API.
