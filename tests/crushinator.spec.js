var assert = require('assert');
var crushinator = require('../tmp/es5/crushinator');

describe('crushinator', function () {
  describe('crushable', function () {
    it('should approve images on tedcdn.com', function () {
      assert(crushinator.crushable('http://tedcdn.com/images/test.jpg'));
    });

    it('should approve images on images.ted.com', function () {
      assert(crushinator.crushable('http://images.ted.com/images/test.jpg'));
    });

    it('should approve images on s3.amazonaws.com', function () {
      assert(crushinator.crushable('http://s3.amazonaws.com/images/test.jpg'));
    });

    it('should approve images on storage.ted.com', function () {
      assert(crushinator.crushable('http://storage.ted.com/images/test.jpg'));
    });

    it('should deny images on unrecognized domains', function () {
      assert(!crushinator.crushable('http://test.com/images/test.jpg'));
    });
  });

  describe('uncrush', function () {
    it('should revert images that were crushed through tedcdnpi-a.akamaihd.net', function () {
      assert.equal(
        crushinator.uncrush('https://tedcdnpi-a.akamaihd.net/r/assets.tedcdn.com/images/playlists/what_makes_you_happy.jpg?ll=1&quality=89&w=500'),
        'https://assets.tedcdn.com/images/playlists/what_makes_you_happy.jpg'
      );
    });

    it('should revert images that were crushed through img.tedcdn.com', function () {
      assert.equal(
        crushinator.uncrush('http://img.tedcdn.com/r/assets.tedcdn.com/images/playlists/what_makes_you_happy.jpg?ll=1&quality=89&w=500'),
        'http://assets.tedcdn.com/images/playlists/what_makes_you_happy.jpg'
      );
    });

    it('should revert images that were crushed through img-ssl.tedcdn.com', function () {
      assert.equal(
        crushinator.uncrush('https://img-ssl.tedcdn.com/r/assets.tedcdn.com/images/playlists/what_makes_you_happy.jpg?ll=1&quality=89&w=500'),
        'https://assets.tedcdn.com/images/playlists/what_makes_you_happy.jpg'
      );
    });
  });

  describe('crush', function () {
    it('should provide Crushinator URLs for crushable images', function () {
      assert.equal(
        crushinator.crush('https://images.ted.com/image.jpg', 'w=200'),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=200'
      );
    });

    it('should produce HTTPS URLs even from HTTP URLs', function () {
      assert.equal(
        crushinator.crush('http://images.ted.com/image.jpg', 'w=200'),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=200'
      );
    });

    it('should return original URL for images hosted outside the whitelist', function () {
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
  });
});
