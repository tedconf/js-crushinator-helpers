import assert from 'assert';
import * as sinon from 'sinon';

import * as crushinator from '../src/crushinator';

// Hosts where crushable images are stored
const imageHosts = [
  'assets.tedcdn.com',
  'pb-assets.tedcdn.com',
  'pe.tedcdn.com',
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
  'pi.tedcdn.com',
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

    it('should uncomplainingly disconfirm incoherent values', function () {
      assert(!crushinator.crushable(undefined));
      assert(!crushinator.crushable(Infinity));
    });
  });

  describe('uncrush', function () {
    crushinatorHosts.forEach(function (crushinatorHost) {
      it('should revert images that were crushed by ' + crushinatorHost, function () {
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

    it('should politely pass on uncrushing incoherent values', function () {
      assert.equal(crushinator.uncrush(undefined), undefined);
      assert.equal(crushinator.uncrush(Infinity), Infinity);
    });
  });

  describe('crush', function () {
    let sandbox = sinon.sandbox.create();
    let uncrushed;
    let crushed;

    beforeEach(function () {
      uncrushed = 'https://images.ted.com/image.jpg';
      crushed = 'https://pi.tedcdn.com/r/images.ted.com/image.jpg';

      sandbox.spy(console, 'warn');
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('should politely pass on crushing incoherent values', function () {
      assert.equal(crushinator.crush(undefined), undefined);
      assert.equal(crushinator.crush(Infinity), Infinity);
    });

    it('should warn about deprecation of the deprecated query string format', function () {
      assert.equal(
        crushinator.crush(uncrushed, 'w=320'),
        crushed + '?w=320'
      );

      sinon.assert.calledOnce(console.warn);
      sinon.assert.calledWith(console.warn,
        'Sending Crushinator options as a query string is ' +
        'deprecated. Please use the object format.');
    });

    it('should return the original URL for images hosted outside the whitelist', function () {
      assert.equal(
        crushinator.crush('http://celly.xxx/waffles.jpg', { width: 320 }),
        'http://celly.xxx/waffles.jpg'
      );
    });

    it('should avoid double-crushing images', function () {
      let url = crushed + '?w=320';
      assert.equal(
        crushinator.crush(url, { width: 640 }),
        crushed + '?w=640'
      );
    });

    it('should update old Crushinator URLs to the new host', function () {
      let url = 'https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg';
      assert.equal(
        crushinator.crush(url, { width: 320 }),
        'https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=320'
      );
    });

    it('should exclude the query marker when no options are provided', function () {
      let url = 'https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg';

      assert.equal(
        crushinator.crush(url),
        'https://pi.tedcdn.com/r/images.ted.com/image.jpg'
      );

      assert.equal(
        crushinator.crush(url, {}),
        'https://pi.tedcdn.com/r/images.ted.com/image.jpg'
      );
    });

    // Host tests
    context('Host testing', function () {
      imageHosts.forEach(function (imageHost) {
        it('should provide secure Crushinator URLs for images hosted on ' + imageHost, function () {
          let url = '//' + imageHost + '/image.jpg';

          assert.equal(
            crushinator.crush('http:' + url, { width: 200 }),
            'https://pi.tedcdn.com/r/' + imageHost + '/image.jpg?w=200'
          );

          assert.equal(
            crushinator.crush('https:' + url, { width: 200 }),
            'https://pi.tedcdn.com/r/' + imageHost + '/image.jpg?w=200'
          );
        });
      });
    });

    // Testing configuration overrides
    context('with configurations', function () {
      const defaults = Object.assign({}, crushinator.config);

      afterEach(function () {
        Object.assign(crushinator.config, defaults);
      });

      it('should use the crushinator host override', function () {
        crushinator.config.host = 'https://example.com';
        assert.equal(
          crushinator.crush('https://images.ted.com/image.jpg'),
          'https://example.com/r/images.ted.com/image.jpg'
        );
      });
    });

    // Testing the options API
    context('options API', function () {
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

      it('should recognize the fit option', function () {
        assert.equal(
          crushinator.crush(uncrushed, {
            width: 320, height: 240,
            fit: true,
          }),
          crushed + '?w=320&h=240&op=%5E&gravity=c&c=320%2C240'
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
