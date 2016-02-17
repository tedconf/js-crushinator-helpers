# JS Crushinator Helpers

JavaScript helpers to produce [Crushinator](https://github.com/tedconf/crushinator) image URLs.

    crushinator.crush('http://images.ted.com/image.jpg', 'w=320')
      // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'

## API

This library provides the following methods:

### crush ( url , [ options ] )

* url: (string, required) - URL of the image you would like to be crushed.
* options: (string, optional) - String of query params corresponding to [crushinator's query params](https://github.com/tedconf/crushinator#image-resize-get-values)

For images on whitelisted domains, this method will return the URL for a crushed version of the specified image:

    crushinator.crush('http://images.ted.com/image.jpg', 'w=320')
      // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'

For images hosted outside Crushinator's whitelisted domains, it will simply return the original URL:

    crushinator.crush('http://celly.xxx/waffles.jpg', 'w=320')
      // => 'http://celly.xxx/waffles.jpg'

It will also avoid double-crushing images, and will update old Crushinator URLs to the new host:

    crushinator.crush('https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320', 'w=640')
      // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=640'

    crushinator.crush('https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg', 'w=320')
      // => 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'

### uncrush ( url )

* url: (string, required) - URL of previously crushed image.

Restore a previously crushed URL to its original form.

Note that the protocol must be borrowed from the crushed URL regardless of whether or not the host actually supports HTTPS.

    crushinator.uncrush('https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320')
      // => 'https://images.ted.com/image.jpg'

### crushable ( url )

* url: (string, required) - URL of image to check.

Returns `true` if the image's host is in Crushinator's whitelist, `false` otherwise.

    crushinator.crushable('http://images.ted.com/image.jpg')
      // => true

    crushinator.crushable('http://celly.xxx/waffles.jpg')
      // => false
