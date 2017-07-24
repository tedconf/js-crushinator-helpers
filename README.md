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
Boolean. Shorthand which, when enabled, sets a number of default options which are useful for Crushinator's most common use cases.

It is enabled (true) by default, and can be disabled by setting to false:

```
crushinator.crush('https://images.ted.com/image.jpg', { defaults: false })
```

When enabled, the following defaults are included:

* [`fit: true`](#fit)
* [`quality: 82`](#quality)
* [`unsharp: true`](#unsharp)

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
String. When cropping an image (including "best fit" cropping) it's sometimes useful to dynamically specify a dynamic start point for where the crop begins in addition to the standard pixel offset. The align option allows you to specify whether you want cropping to start at the `"top"`, `"bottom"`, `"left"`, `"right"`, or `"middle"` of the image.

Example:

```
crushinator.crush('https://images.ted.com/image.jpg', {
  width: 320,
  height: 240,
  fit: true,
  align: 'top',
})
```

### blur
Number or Boolean. A numeric value indicates the blur sigma (loosely: the blur spread amount) in pixels, while a boolean `true` uses a default blur sigma of 2.

```
crushinator.crush('https://images.ted.com/image.jpg', { blur: 1.5 })
```

You may further tune the blur behavior by instead specifying an object, with the following properties:

* `sigma` – numeric; blur "spread" amount in pixels.
* `radius` – numeric; maximum pixel area to consider. Should be larger than (probably at least 2x) the blur sigma.

Example with object value:

```
crushinator.crush('https://images.ted.com/image.jpg', {
  blur: { sigma: 1.5, radius: 3 },
})
```

### gamma
Number or Object. If numeric, this value is used as a gamma correction multiplier applied to all channels in an image:

```
crushinator.crush('https://images.ted.com/image.jpg', { gamma: 1.5 })
```

Values less than 1 darken the image, and values greater than 1 lighten it. Reasonable values extend from 0.8 to 2.3.

An object form is also supported for channel-specific gamma correction, where properties `red`, `green`, and `blue` indicate gamma correction multipliers for their respective channels:

```
crushinator.crush('https://images.ted.com/image.jpg', {
  gamma: { red: 1.7, green: 2.3, blue: 1.2 },
})
```

### grayscale
Boolean. If true, Crushinator fully desaturates the image, resulting in a rich grayscale version.

```
crushinator.crush('https://images.ted.com/image.jpg', { grayscale: true })
```

Desaturated images are sometimes considered too dark for their intended purpose, so the `grayscale` property also supports a numeric value (a decimal percentage) which can be used to darken the output image:

```
crushinator.crush('https://images.ted.com/image.jpg', { grayscale: 0.7 })
```

### unsharp
Boolean or object. Applies an unsharp mask to accentuate image details.

Crushinator's resampling causes fine image details to be softened, resulting in a perceived loss of quality and blurry/smudged images. Applying an unsharp mask improves this situation, while avoiding the increased noise and haloing typically associated with image sharpening.

The unsharp mask is enabled (true) by default, and can be disabled by setting this option to false:

```
crushinator.crush('https://images.ted.com/image.jpg', { unsharp: false })
```

You can also fine tune the default unsharp mask, or set up a custom unsharp mask, by providing an object with the following options:

* `amount` – numeric; decimal percentage representing the strength of the unsharp filter in terms of difference between the sharpened image and the original.
* `sigma` – numeric; size of details to sharpen, in pixels.
* `radius` – numeric; number of pixels to which sharpening should be applied surrounding each target pixel.
* `threshold` – numeric; decimal percentage representing a minimum amount of difference in a pixel vs surrounding colors before it's considered a sharpenable detail.

Example use with all custom tuning options specified:

```
crushinator.crush('https://images.ted.com/image.jpg', {
  unsharp: {
    amount: 0.8,
    sigma: 0.5,
    radius: 2,
    threshold: 0.03,
  },
})
```

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
