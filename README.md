# JS Crushinator Helpers

JavaScript methods to produce [Crushinator'd](https://github.com/tedconf/crushinator) image URLs.

```javascript
crushinator.crush('http://images.ted.com/image.jpg', 'w=320')
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
```

## Installation

### With NPM

```
npm install crushinator-helpers
```

### With Bower

```
bower install crushinator-helpers
```

### Manual

Code in `lib/crushinator.js` can be copied to your application.

This file is in UMD and has no other dependencies, so you can import it as an AMD/CommonJS module or simply let it occupy the `crushinator` namespace in your app's global.

## API

This library provides the following methods:

### crush ( url , [ options ] )

* url: (string, required) - URL of the image you would like to be crushed.
* options: (string, optional) - String of query params corresponding to [crushinator's query params](https://github.com/tedconf/crushinator#image-resize-get-values)

For images on whitelisted domains, this method will return the URL for a crushed version of the specified image:

```javascript
crushinator.crush('http://images.ted.com/image.jpg', 'w=320')
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
```

For images hosted outside Crushinator's whitelisted domains, it will simply return the original URL:

```javascript
crushinator.crush('http://celly.xxx/waffles.jpg', 'w=320')
  // => 'http://celly.xxx/waffles.jpg'
```

It will also avoid double-crushing images, and will update old Crushinator URLs to the new host:

```javascript
crushinator.crush('https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320', 'w=640')
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=640'
```

```javascript
crushinator.crush('https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg', 'w=320')
  // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
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

1. `npm run build` to produce a new `lib/crushinator.js`
2. Update "version" in `package.json` and commit
3. `git tag` the new semver
4. Push master and the new tag upstream
