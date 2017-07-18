import assert from 'assert';
import * as sinon from 'sinon';

import * as crushinator from '../src/crushinator';

// Hosts where crushable images are stored
const imageHosts = [
  'assets.tedcdn.com',
  'pb-assets.tedcdn.com',
  'pa.tedcdn.com',
  'pe.tedcdn.com',
  'pf.tedcdn.com',
  'ph.tedcdn.com',
  'pj.tedcdn.com',
  'pk.tedcdn.com',
  'pl.tedcdn.com',
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

describe('crushinator', () => {
  describe('crushable', () => {
    imageHosts.forEach((imageHost) => {
      it(`should approve images on ${imageHost}`, () => {
        assert(crushinator.crushable(`http://${imageHost}/images/test.jpg`));
        assert(crushinator.crushable(`https://${imageHost}/images/test.jpg`));
      });
    });

    it('should deny images on unrecognized domains', () => {
      assert(!crushinator.crushable('http://test.com/images/test.jpg'));
      assert(!crushinator.crushable('https://test.com/images/test.jpg'));
    });

    it('should uncomplainingly disconfirm incoherent values', () => {
      assert(!crushinator.crushable(undefined));
      assert(!crushinator.crushable(Infinity));
    });
  });

  describe('uncrush', () => {
    crushinatorHosts.forEach((crushinatorHost) => {
      it(`should revert images that were crushed by ${crushinatorHost}`, () => {
        imageHosts.forEach((imageHost) => {
          const url = `//${crushinatorHost}/r/${imageHost}/images/test.jpg?ll=1&quality=89&w=500`;

          assert.equal(
            crushinator.uncrush(`https:${url}`),
            `https://${imageHost}/images/test.jpg`,
          );

          assert.equal(
            crushinator.uncrush(`http:${url}`),
            `http://${imageHost}/images/test.jpg`,
          );
        });
      });
    });

    it('should leave uncrushed images intact', () => {
      assert.equal(
        crushinator.uncrush('http://test.com/images/test.jpg'),
        'http://test.com/images/test.jpg',
      );
    });

    it('should politely pass on uncrushing incoherent values', () => {
      assert.equal(crushinator.uncrush(undefined), undefined);
      assert.equal(crushinator.uncrush(Infinity), Infinity);
    });
  });

  describe('crush', () => {
    const sandbox = sinon.sandbox.create();

    let uncrushed;
    let crushed;

    beforeEach(() => {
      uncrushed = 'https://images.ted.com/image.jpg';
      crushed = 'https://pi.tedcdn.com/r/images.ted.com/image.jpg';

      sandbox.spy(console, 'warn');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should politely pass on crushing incoherent values', () => {
      assert.equal(crushinator.crush(undefined), undefined);
      assert.equal(crushinator.crush(Infinity), Infinity);
    });

    it('should warn about deprecation of the deprecated query string format', () => {
      assert.equal(
        crushinator.crush(uncrushed, 'w=320'),
        `${crushed}?w=320`,
      );

      sinon.assert.calledOnce(console.warn);
      sinon.assert.calledWith(console.warn,
        'Sending Crushinator options as a query string is ' +
        'deprecated. Please use the object format.');
    });

    it('should return the original URL for images hosted outside the whitelist', () => {
      assert.equal(
        crushinator.crush('http://celly.xxx/waffles.jpg', { width: 320 }),
        'http://celly.xxx/waffles.jpg',
      );
    });

    it('should avoid double-crushing images', () => {
      const url = `${crushed}?w=320`;
      assert.equal(
        crushinator.crush(url, { width: 640 }),
        `${crushed}?w=640`,
      );
    });

    it('should update old Crushinator URLs to the new host', () => {
      const url = 'https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg';
      assert.equal(
        crushinator.crush(url, { width: 320 }),
        'https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=320',
      );
    });

    it('should exclude the query marker when no options are provided', () => {
      const url = 'https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg';

      assert.equal(
        crushinator.crush(url),
        'https://pi.tedcdn.com/r/images.ted.com/image.jpg',
      );

      assert.equal(
        crushinator.crush(url, {}),
        'https://pi.tedcdn.com/r/images.ted.com/image.jpg',
      );
    });

    // Host tests
    context('Host testing', () => {
      imageHosts.forEach((imageHost) => {
        it(`should provide secure Crushinator URLs for images hosted on ${imageHost}`, () => {
          const url = `//${imageHost}/image.jpg`;

          assert.equal(
            crushinator.crush(`http:${url}`, { width: 200 }),
            `https://pi.tedcdn.com/r/${imageHost}/image.jpg?w=200`,
          );

          assert.equal(
            crushinator.crush(`https:${url}`, { width: 200 }),
            `https://pi.tedcdn.com/r/${imageHost}/image.jpg?w=200`,
          );
        });
      });
    });

    // Testing configuration overrides
    context('with configurations', () => {
      const defaults = Object.assign({}, crushinator.config);

      afterEach(() => {
        Object.assign(crushinator.config, defaults);
      });

      it('should use the crushinator host override', () => {
        crushinator.config.host = 'https://example.com';
        assert.equal(
          crushinator.crush('https://images.ted.com/image.jpg'),
          'https://example.com/r/images.ted.com/image.jpg',
        );
      });
    });

    // Testing the options API
    context('options API', () => {
      it('should recognize the width option', () => {
        assert.equal(
          crushinator.crush(uncrushed, { width: 300 }),
          `${crushed}?w=300`,
        );
      });

      it('should recognize the height option', () => {
        assert.equal(
          crushinator.crush(uncrushed, { height: 300 }),
          `${crushed}?h=300`,
        );
      });

      it('should recognize the quality option', () => {
        assert.equal(
          crushinator.crush(uncrushed, { quality: 90 }),
          `${crushed}?quality=90`,
        );
      });

      it('should support multiple options', () => {
        assert.equal(
          crushinator.crush(uncrushed, { width: 640, height: 480, quality: 90 }),
          `${crushed}?w=640&h=480&quality=90`,
        );
      });

      it('should recognize the crop size options', () => {
        assert.equal(
          crushinator.crush(uncrushed, { crop: { width: 320, height: 240 } }),
          `${crushed}?precrop=320%2C240`,
        );
      });

      it('should recognize the crop location options', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            crop: {
              width: 320,
              height: 240,
              x: 250,
              y: 150,
            },
          }),
          `${crushed}?precrop=320%2C240%2C250%2C150`,
        );
      });

      it('should recognize the crop choreography option', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            crop: {
              width: 320,
              height: 240,
              x: 250,
              y: 150,
              afterResize: true,
            },
          }),
          `${crushed}?c=320%2C240%2C250%2C150`,
        );
      });

      it('should recognize the fit option', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            width: 320,
            height: 240,
            fit: true,
          }),
          `${crushed}?w=320&h=240&op=%5E&gravity=c&c=320%2C240`,
        );
      });

      it('should recognize the align option', () => {
        assert.equal(
          crushinator.crush(uncrushed, { align: 'top' }),
          `${crushed}?gravity=n`,
        );

        assert.equal(
          crushinator.crush(uncrushed, { align: 'bottom' }),
          `${crushed}?gravity=s`,
        );

        assert.equal(
          crushinator.crush(uncrushed, { align: 'left' }),
          `${crushed}?gravity=w`,
        );

        assert.equal(
          crushinator.crush(uncrushed, { align: 'right' }),
          `${crushed}?gravity=e`,
        );

        assert.equal(
          crushinator.crush(uncrushed, { align: 'middle' }),
          `${crushed}?gravity=c`,
        );
      });

      it('should recognize the custom query option', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            query: {
              foo: 1,
              bar: 'baz',
            },
          }),
          `${crushed}?foo=1&bar=baz`,
        );
      });

      it('should recognize crop options in hyphenated form', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            'crop-width': 320,
            'crop-height': 240,
            'crop-x': 250,
            'crop-y': 150,
            'crop-afterResize': true,
          }),
          `${crushed}?c=320%2C240%2C250%2C150`,
        );
      });

      it('should recognize the blur option', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            blur: { radius: 2, sigma: 10 },
          }),
          `${crushed}?blur=2%2C10`,
        );
      });

      it('should recognize the gamma option', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            gamma: { red: 50, green: 10, blue: 10 },
          }),
          `${crushed}?gamma=50%2C10%2C10`,
        );
      });

      it('should recognize the grayscale option', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            grayscale: 90,
          }),
          `${crushed}?grayscale=90`,
        );
      });

      it('should recognize the unsharp option', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            unsharp: { radius: 2, sigma: 0.5, amount: 0.8, threshold: 0 },
          }),
          `${crushed}?u[r]=2&u[s]=0.5&u[a]=0.8&u[t]=0`,
        );
      });
    });
  });
});
