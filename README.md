# JS Crushinator Helpers [![NPM Version](https://img.shields.io/npm/v/ted-crushinator-helpers.svg?style=flat)](https://npmjs.org/package/ted-crushinator-helpers) [![Build Status](https://travis-ci.org/tedconf/js-crushinator-helpers.svg?branch=master)](https://travis-ci.org/tedconf/js-crushinator-helpers)

JavaScript methods to produce [Crushinator'd](https://github.com/tedconf/crushinator) image URLs.

```javascript
crushinator.crush('http://images.ted.com/image.jpg', 'w=320')
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
```

## Installation

### With NPM

```
npm install ted-crushinator-helpers
```

### With Bower

```
bower install ted-crushinator-helpers
```

### Manual

Code in `dist/crushinator.js` can be copied to your application.

This file is in UMD and has no other dependencies, so you can import it as an AMD/CommonJS module or simply let it occupy the `crushinator` namespace in your app's global.

## API

This library provides the following methods:

### crush ( url , [ options = {} ] )

* url: (string, required) - URL of the image you would like to be crushed.
* options: (object, optional) - Crushinator image options as a Plain Old JavaScript Object. These can be:
  * width: (number) - Target image width in pixels.
  * height: (number) - Target image height in pixels.
  * quality: (number) - Image quality as a percentage (0-100).
  * crop: (object) - Crop configuration. (See details below.)

For images on whitelisted domains, this method will return the URL for a crushed version of the specified image:

```javascript
crushinator.crush('http://images.ted.com/image.jpg', { width:  320 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
```

For images hosted outside Crushinator's whitelisted domains, it will simply return the original URL:

```javascript
crushinator.crush('http://celly.xxx/waffles.jpg', { width: 320 })
  // => 'http://celly.xxx/waffles.jpg'
```

It will also avoid double-crushing images, and will update old Crushinator URLs to the new host:

```javascript
crushinator.crush('https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320', { width: 640 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=640'
```

```javascript
crushinator.crush('https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg', { width: 320 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
```

#### crush options

Some more detail and examples for individual Crushinator helper options:

##### width

```javascript
crushinator.crush('http://images.ted.com/image.jpg', { width: 320 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
```

##### height

```javascript
crushinator.crush('http://images.ted.com/image.jpg', { height: 240 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?h=240'
```

##### quality

```javascript
crushinator.crush('http://images.ted.com/image.jpg', { quality: 93 })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?quality=93'
```

##### crop

Crop configuration options are passed in as an object:

* width: (number) - Width of cropped section.
* height: (number) - Height of cropped section.
* x: (number) - Leftmost coordinate at which to start crop.
* y: (number) - Topmost coordinate at which to start crop.
* afterResize: (boolean) - `true` if you want to crop the resized image rather than the original, `false` or omitted otherwise.

```javascript
crushinator.crush('http://images.ted.com/image.jpg', {
    crop: {
      width: 200, height: 100,
      x: 50, y: 25,
      afterResize: true
    }
  })
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?quality=93'
```

### uncrush ( url )

* url: (string, required) - URL of previously crushed image.

Restore a previously crushed URL to its original form.

Note that the protocol must be borrowed from the crushed URL regardless of whether or not the host actually supports HTTPS.

```javascript
crushinator.uncrush('https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320')
  // => 'https://images.ted.com/image.jpg'
```

### crushable ( url )

* url: (string, required) - URL of image to check.

Returns `true` if the image's host is in Crushinator's whitelist, `false` otherwise.

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
* `nvm use` and if the required Node version is not installed on your system, `nvm install <version>`
* `npm install`

### Running tests

`npm test` will lint and test the library.

### Releasing a new version

1. `npm run build` to produce a new `dist/crushinator.js`
2. Update "version" in `package.json` and commit
3. `git tag` the new semver
4. Push master and the new tag upstream
