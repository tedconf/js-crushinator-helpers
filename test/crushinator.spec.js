import assert from 'assert';
import * as crushinator from '../src/crushinator';

// Hosts where crushable images are stored
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

// Hosts that have historically been used for crushinator
const crushinatorHosts = [
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
          let url =
            '//' + crushinatorHost + '/r/' +
            imageHost + '/images/test.jpg?ll=1&quality=89&w=500';

          assert.equal(
            crushinator.uncrush('https:' + url),
            'https://' + imageHost + '/images/test.jpg'
          );

          assert.equal(
            crushinator.uncrush('http:' + url),
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
        let url = '//' + imageHost + '/image.jpg';

        assert.equal(
          crushinator.crush('http:' + url, 'w=200'),
          'https://tedcdnpi-a.akamaihd.net/r/' + imageHost + '/image.jpg?w=200'
        );

        assert.equal(
          crushinator.crush('https:' + url, 'w=200'),
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
      let url = 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320';
      assert.equal(
        crushinator.crush(url, 'w=640'),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=640'
      );
    });

    it('should update old Crushinator URLs to the new host', function () {
      let url = 'https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg';
      assert.equal(
        crushinator.crush(url, 'w=320'),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg?w=320'
      );
    });

    it('should exclude the query marker when no options are provided', function () {
      let url = 'https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg';

      assert.equal(
        crushinator.crush(url),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg'
      );

      assert.equal(
        crushinator.crush(url, ''),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg'
      );

      assert.equal(
        crushinator.crush(url, {}),
        'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg'
      );
    });

    context('with POJO options', function () {
      const uncrushed = 'https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg';
      const crushed = 'https://tedcdnpi-a.akamaihd.net/r/images.ted.com/image.jpg';

      it('should recognize the width option', function () {
        assert.equal(
          crushinator.crush(uncrushed, { width: 300 }),
          crushed + '?w=300'
        );
      });

      it('should recognize the height option', function () {
        assert.equal(
          crushinator.crush(uncrushed, { height: 300 }),
          crushed + '?h=300'
        );
      });

      it('should recognize the quality option', function () {
        assert.equal(
          crushinator.crush(uncrushed, { quality: 90 }),
          crushed + '?quality=90'
        );
      });

      it('should support multiple options', function () {
        assert.equal(
          crushinator.crush(uncrushed, { width: 640, height: 480, quality: 90 }),
          crushed + '?w=640&h=480&quality=90'
        );
      });

      it('should recognize the crop size options', function () {
        assert.equal(
          crushinator.crush(uncrushed, { crop: { width: 320, height: 240 } }),
          crushed + '?precrop=320%2C240'
        );
      });

      it('should recognize the crop location options', function () {
        assert.equal(
          crushinator.crush(uncrushed, {
            crop: {
              width: 320, height: 240,
              x: 250, y: 150,
            },
          }),
          crushed + '?precrop=320%2C240%2C250%2C150'
        );
      });

      it('should recognize the crop choreography option', function () {
        assert.equal(
          crushinator.crush(uncrushed, {
            crop: {
              width: 320, height: 240,
              x: 250, y: 150,
              afterResize: true,
            },
          }),
          crushed + '?c=320%2C240%2C250%2C150'
        );
      });

      it('should recognize the custom query option', function () {
        assert.equal(
          crushinator.crush(uncrushed, {
            query: {
              foo: 1,
              bar: 'baz',
            },
          }),
          crushed + '?foo=1&bar=baz'
        );
      });

      it('should recognize crop options in hyphenated form', function () {
        assert.equal(
          crushinator.crush(uncrushed, {
            'crop-width': 320, 'crop-height': 240,
            'crop-x': 250, 'crop-y': 150,
            'crop-afterResize': true,
          }),
          crushed + '?c=320%2C240%2C250%2C150'
        );
      });
    });
  });
});
