import assert from 'assert';
import * as sinon from 'sinon';

import * as crushinator from '../src/crushinator';

// Hosts where crushable images are stored
const imageHosts = crushinator.imageHosts;

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
    const defaults = Object.assign({}, crushinator.config);
    const sandbox = sinon.sandbox.create();

    let uncrushed;
    let crushed;

    beforeEach(() => {
      // Disable default options for most tests to simplify test cases
      crushinator.config.defaults = false;

      uncrushed = 'https://images.ted.com/image.jpg';
      crushed = 'https://pi.tedcdn.com/r/images.ted.com/image.jpg';

      sandbox.spy(console, 'warn');
    });

    afterEach(() => {
      sandbox.restore();

      // Restore original configuration
      Object.assign(crushinator.config, defaults);
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
      it('should use the crushinator host override', () => {
        crushinator.config.host = 'https://example.com';
        assert.equal(
          crushinator.crush('https://images.ted.com/image.jpg'),
          'https://example.com/r/images.ted.com/image.jpg',
        );
      });
    });

    // Testing default options
    context('with defaults', () => {
      const defaultParams = 'u%5Br%5D=2&u%5Bs%5D=0.5&u%5Ba%5D=0.8&u%5Bt%5D=0&quality=82';

      context('disabled via config', () => {
        beforeEach(() => {
          crushinator.config.defaults = false;
        });

        it('should not use default options', () => {
          assert.equal(crushinator.crush(uncrushed), crushed);
        });
      });

      context('enabled via config', () => {
        beforeEach(() => {
          crushinator.config.defaults = true;
        });

        it('should use the default options', () => {
          assert.equal(crushinator.crush(uncrushed), `${crushed}?${defaultParams}`);
        });
      });

      context('enabled via options, disabled via config', () => {
        beforeEach(() => {
          crushinator.config.defaults = false;
        });

        it('should use the default options', () => {
          assert.equal(crushinator.crush(uncrushed, { defaults: true }), `${crushed}?${defaultParams}`);
        });
      });

      context('disabled via options, enabled via config', () => {
        beforeEach(() => {
          crushinator.config.defaults = true;
        });

        it('should not use default options', () => {
          assert.equal(crushinator.crush(uncrushed, { defaults: false }), crushed);
        });
      });

      context('enabled but partially overridden by options', () => {
        beforeEach(() => {
          crushinator.config.defaults = true;
        });

        it('should use the default options', () => {
          assert.equal(
            crushinator.crush(uncrushed, { quality: 99 }),
            `${crushed}?u%5Br%5D=2&u%5Bs%5D=0.5&u%5Ba%5D=0.8&u%5Bt%5D=0&quality=99`,
          );
        });
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
            blur: { radius: 6, sigma: 3 },
          }),
          `${crushed}?blur=6%2C3`,
        );
      });

      it('should support blur with sigma only', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            blur: 4,
          }),
          `${crushed}?blur=0%2C4`,
        );
      });

      it('should support blur as a boolean', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            blur: true,
          }),
          `${crushed}?blur=0%2C2`,
        );
      });

      it('should recognize global gamma correction', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            gamma: 1.2,
          }),
          `${crushed}?gamma=1.2`,
        );
      });

      it('should recognize channel-specific gamma correction', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            gamma: { red: 1.2, green: 1.3, blue: 1.4 },
          }),
          `${crushed}?gamma=1.2%2C1.3%2C1.4`,
        );

        assert.equal(
          crushinator.crush(uncrushed, {
            gamma: { green: 1.3 },
          }),
          `${crushed}?gamma=1%2C1.3%2C1`,
        );
      });

      it('should recognize the grayscale option', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            grayscale: 0.9,
          }),
          `${crushed}?grayscale=90`,
        );

        assert.equal(
          crushinator.crush(uncrushed, {
            grayscale: true,
          }),
          `${crushed}?grayscale=100`,
        );
      });

      it('should recognize the unsharp option', () => {
        assert.equal(
          crushinator.crush(uncrushed, {
            unsharp: { radius: 1.4, sigma: 0.7, amount: 0.8, threshold: 1 },
          }),
          `${crushed}?u%5Br%5D=1.4&u%5Bs%5D=0.7&u%5Ba%5D=0.8&u%5Bt%5D=1`,
        );
      });

      it('should fill in default unsharp values if needed', () => {
        assert.equal(
          crushinator.crush(uncrushed, { unsharp: true }),
          `${crushed}?u%5Br%5D=2&u%5Bs%5D=0.5&u%5Ba%5D=0.8&u%5Bt%5D=0`,
        );
      });
    });
  });
});
