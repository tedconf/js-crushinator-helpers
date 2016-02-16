var assert = require('assert');
var crushinator = require('../tmp/es5/crushinator');

// Hosts where crushable images are stored
var imageHosts = [
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
  'ems.ted.com',
  'ems-staging.ted.com',
];

// Hosts that have historically been used for crushinator
var crushinatorHosts = [
  'img.tedcdn.com',
  'img-ssl.tedcdn.com',
  'tedcdnpi-a.akamaihd.net',
];

describe('crushinator', function () {
  describe('crushable', function () {
    imageHosts.forEach(function (imageHost) {
      it('should approve images on ' + imageHost, function () {
        assert(crushinator.crushable('http://' + imageHost + '/images/test.jpg'));
        assert(crushinator.crushable('https://' + imageHost + '/images/test.jpg'));
      });
    });

    it('should deny images on unrecognized domains', function () {
      assert(!crushinator.crushable('http://test.com/images/test.jpg'));
      assert(!crushinator.crushable('https://test.com/images/test.jpg'));
    });
  });

  describe('uncrush', function () {
    crushinatorHosts.forEach(function (crushinatorHost) {
      it('should revert images that were hosted on ' + crushinatorHost, function () {
        imageHosts.forEach(function (imageHost) {
          assert.equal(
            crushinator.uncrush('https://' + crushinatorHost + '/r/' + imageHost + '/images/test.jpg?ll=1&quality=89&w=500'),
            'https://' + imageHost + '/images/test.jpg'
          );

          assert.equal(
            crushinator.uncrush('http://' + crushinatorHost + '/r/' + imageHost + '/images/test.jpg?ll=1&quality=89&w=500'),
            'http://' + imageHost + '/images/test.jpg'
          );
        });
      });
    });

    it('should leave uncrushed images intact', function () {
      assert.equal(
        crushinator.uncrush('http://test.com/images/test.jpg'),
        'http://test.com/images/test.jpg'
      );
    });
  });

  describe('crush', function () {
    imageHosts.forEach(function (imageHost) {
      it('should provide secure Crushinator URLs for images hosted on ' + imageHost, function () {
        assert.equal(
          crushinator.crush('http://' + imageHost + '/image.jpg', 'w=200'),
          'https://tedcdnpi-a.akamaihd.net/r/' + imageHost + '/image.jpg?w=200'
        );

        assert.equal(
          crushinator.crush('https://' + imageHost + '/image.jpg', 'w=200'),
          'https://tedcdnpi-a.akamaihd.net/r/' + imageHost + '/image.jpg?w=200'
        );
      });
    });

    it('should return the original URL for images hosted outside the whitelist', function () {
      assert.equal(
        crushinator.crush('http://celly.xxx/waffles.jpg', 'w=320'),
        'http://celly.xxx/waffles.jpg'
      );
    });

    it('should avoid double-crushing images', function () {
      assert.equal(
        crushinator.crush('https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320', 'w=640'),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=640'
      );
    });

    it('should update old Crushinator URLs to the new host', function () {
      assert.equal(
        crushinator.crush('https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg', 'w=320'),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
      );
    });

    it('should exclude the query marker when no options are provided', function () {
      assert.equal(
        crushinator.crush('https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg'),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg'
      );
    });
  });
});
