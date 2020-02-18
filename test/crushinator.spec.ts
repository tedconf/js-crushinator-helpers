import * as crushinator from '../src';

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
    imageHosts.forEach(imageHost => {
      test(`should approve images on ${imageHost}`, () => {
        expect(
          crushinator.crushable(`http://${imageHost}/images/test.jpg`),
        ).toBeTruthy();
        expect(
          crushinator.crushable(`https://${imageHost}/images/test.jpg`),
        ).toBeTruthy();
      });
    });

    test('should deny images on unrecognized domains', () => {
      expect(
        crushinator.crushable('http://test.com/images/test.jpg'),
      ).toBeFalsy();
      expect(
        crushinator.crushable('https://test.com/images/test.jpg'),
      ).toBeFalsy();
    });

    test('should uncomplainingly disconfirm incoherent values', () => {
      // @ts-ignore
      expect(crushinator.crushable(undefined)).toBeFalsy();
      // @ts-ignore
      expect(crushinator.crushable(Infinity)).toBeFalsy();
    });
  });

  describe('uncrush', () => {
    crushinatorHosts.forEach(crushinatorHost => {
      test(`should revert images that were crushed by ${crushinatorHost}`, () => {
        imageHosts.forEach(imageHost => {
          const url = `//${crushinatorHost}/r/${imageHost}/images/test.jpg?ll=1&quality=89&w=500`;

          expect(crushinator.uncrush(`https:${url}`)).toEqual(
            `https://${imageHost}/images/test.jpg`,
          );
          expect(crushinator.uncrush(`http:${url}`)).toEqual(
            `http://${imageHost}/images/test.jpg`,
          );
        });
      });
    });

    test('should leave uncrushed images intact', () => {
      expect(crushinator.uncrush('http://test.com/images/test.jpg')).toEqual(
        'http://test.com/images/test.jpg',
      );
    });

    test('should politely pass on uncrushing incoherent values', () => {
      // @ts-ignore
      expect(crushinator.uncrush(undefined)).toEqual(undefined);
      // @ts-ignore
      expect(crushinator.uncrush(Infinity)).toEqual(Infinity);
    });
  });

  describe('crush', () => {
    const defaults = Object.assign({}, crushinator.config);
    let uncrushed: string;
    let crushed: string;

    beforeEach(() => {
      // Disable default options for most tests to simplify test cases
      crushinator.config.defaults = false;

      uncrushed = 'https://images.ted.com/image.jpg';
      crushed = 'https://pi.tedcdn.com/r/images.ted.com/image.jpg';
    });

    afterEach(() => {
      // Restore original configuration
      Object.assign(crushinator.config, defaults);
    });

    test('should politely pass on crushing incoherent values', () => {
      // @ts-ignore
      expect(crushinator.crush(undefined)).toEqual(undefined);
      // @ts-ignore
      expect(crushinator.crush(Infinity)).toEqual(Infinity);
    });

    test('should return the original URL for images hosted outside the whitelist', () => {
      expect(
        crushinator.crush('http://celly.xxx/waffles.jpg', { width: 320 }),
      ).toEqual('http://celly.xxx/waffles.jpg');
    });

    test('should avoid double-crushing images', () => {
      const url = `${crushed}?w=320`;
      expect(crushinator.crush(url, { width: 640 })).toEqual(
        `${crushed}?w=640`,
      );
    });

    test('should update old Crushinator URLs to the new host', () => {
      const url = 'https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg';
      expect(crushinator.crush(url, { width: 320 })).toEqual(
        'https://pi.tedcdn.com/r/images.ted.com/image.jpg?w=320',
      );
    });

    test('should exclude the query marker when no options are provided', () => {
      const url = 'https://img-ssl.tedcdn.com/r/images.ted.com/image.jpg';

      expect(crushinator.crush(url)).toEqual(
        'https://pi.tedcdn.com/r/images.ted.com/image.jpg',
      );

      expect(crushinator.crush(url, {})).toEqual(
        'https://pi.tedcdn.com/r/images.ted.com/image.jpg',
      );
    });

    // Host tests
    describe('Host testing', () => {
      imageHosts.forEach(imageHost => {
        test(`should provide secure Crushinator URLs for images hosted on ${imageHost}`, () => {
          const url = `//${imageHost}/image.jpg`;

          expect(crushinator.crush(`http:${url}`, { width: 200 })).toEqual(
            `https://pi.tedcdn.com/r/${imageHost}/image.jpg?w=200`,
          );

          expect(crushinator.crush(`https:${url}`, { width: 200 })).toEqual(
            `https://pi.tedcdn.com/r/${imageHost}/image.jpg?w=200`,
          );
        });
      });
    });

    // Testing configuration overrides
    describe('with configurations', () => {
      test('should use the crushinator host override', () => {
        crushinator.config.host = 'https://example.com';
        expect(crushinator.crush('https://images.ted.com/image.jpg')).toEqual(
          'https://example.com/r/images.ted.com/image.jpg',
        );
      });
    });

    // Testing default options
    describe('with defaults', () => {
      const defaultParams =
        'u%5Br%5D=2&u%5Bs%5D=0.5&u%5Ba%5D=0.8&u%5Bt%5D=0.03&quality=82';

      describe('disabled via config', () => {
        beforeEach(() => {
          crushinator.config.defaults = false;
        });

        test('should not use default options', () => {
          expect(crushinator.crush(uncrushed)).toEqual(crushed);
        });
      });

      describe('enabled via config', () => {
        beforeEach(() => {
          crushinator.config.defaults = true;
        });

        test('should use the default options', () => {
          expect(crushinator.crush(uncrushed)).toEqual(
            `${crushed}?${defaultParams}`,
          );
        });
      });

      describe('enabled via options, disabled via config', () => {
        beforeEach(() => {
          crushinator.config.defaults = false;
        });

        test('should use the default options', () => {
          expect(crushinator.crush(uncrushed, { defaults: true })).toEqual(
            `${crushed}?${defaultParams}`,
          );
        });
      });

      describe('disabled via options, enabled via config', () => {
        beforeEach(() => {
          crushinator.config.defaults = true;
        });

        test('should not use default options', () => {
          expect(crushinator.crush(uncrushed, { defaults: false })).toEqual(
            crushed,
          );
        });
      });

      describe('enabled but partially overridden by options', () => {
        beforeEach(() => {
          crushinator.config.defaults = true;
        });

        test('should use the default options', () => {
          expect(crushinator.crush(uncrushed, { quality: 99 })).toEqual(
            `${crushed}?u%5Br%5D=2&u%5Bs%5D=0.5&u%5Ba%5D=0.8&u%5Bt%5D=0.03&quality=99`,
          );
        });
      });
    });

    // Testing the options API
    describe('options API', () => {
      test('should recognize the width option', () => {
        expect(crushinator.crush(uncrushed, { width: 300 })).toEqual(
          `${crushed}?w=300`,
        );
      });

      test('should recognize the height option', () => {
        expect(crushinator.crush(uncrushed, { height: 300 })).toEqual(
          `${crushed}?h=300`,
        );
      });

      test('should recognize the quality option', () => {
        expect(crushinator.crush(uncrushed, { quality: 90 })).toEqual(
          `${crushed}?quality=90`,
        );
      });

      test('should support multiple options', () => {
        expect(
          crushinator.crush(uncrushed, {
            width: 640,
            height: 480,
            quality: 90,
          }),
        ).toEqual(`${crushed}?w=640&h=480&quality=90`);
      });

      test('should recognize the crop size options', () => {
        expect(
          crushinator.crush(uncrushed, { crop: { width: 320, height: 240 } }),
        ).toEqual(`${crushed}?precrop=320%2C240`);
      });

      test('should recognize the crop location options', () => {
        expect(
          crushinator.crush(uncrushed, {
            crop: {
              width: 320,
              height: 240,
              x: 250,
              y: 150,
            },
          }),
        ).toEqual(`${crushed}?precrop=320%2C240%2C250%2C150`);
      });

      test('should recognize the crop choreography option', () => {
        expect(
          crushinator.crush(uncrushed, {
            crop: {
              width: 320,
              height: 240,
              x: 250,
              y: 150,
              afterResize: true,
            },
          }),
        ).toEqual(`${crushed}?c=320%2C240%2C250%2C150`);
      });

      test('should recognize the fit option', () => {
        expect(
          crushinator.crush(uncrushed, {
            width: 320,
            height: 240,
            fit: true,
          }),
        ).toEqual(`${crushed}?w=320&h=240&op=%5E&c=320%2C240&gravity=t`);
      });

      test('should recognize the align option', () => {
        expect(crushinator.crush(uncrushed, { align: 'top' })).toEqual(
          `${crushed}?gravity=n`,
        );

        expect(crushinator.crush(uncrushed, { align: 'bottom' })).toEqual(
          `${crushed}?gravity=s`,
        );

        expect(crushinator.crush(uncrushed, { align: 'left' })).toEqual(
          `${crushed}?gravity=w`,
        );

        expect(crushinator.crush(uncrushed, { align: 'right' })).toEqual(
          `${crushed}?gravity=e`,
        );

        expect(crushinator.crush(uncrushed, { align: 'middle' })).toEqual(
          `${crushed}?gravity=c`,
        );
      });

      test('should allow custom alignment to override the gravity selected by the fit option', () => {
        expect(
          crushinator.crush(uncrushed, {
            width: 320,
            height: 240,
            align: 'middle',
            fit: true,
          }),
        ).toEqual(`${crushed}?w=320&h=240&gravity=c&op=%5E&c=320%2C240`);
      });

      test('should recognize the custom query option', () => {
        expect(
          crushinator.crush(uncrushed, {
            query: {
              foo: 1,
              bar: 'baz',
            },
          }),
        ).toEqual(`${crushed}?foo=1&bar=baz`);
      });

      test('should recognize crop options in hyphenated form', () => {
        expect(
          crushinator.crush(uncrushed, {
            'crop-width': 320,
            'crop-height': 240,
            'crop-x': 250,
            'crop-y': 150,
            'crop-afterResize': true,
          }),
        ).toEqual(`${crushed}?c=320%2C240%2C250%2C150`);
      });

      test('should recognize the blur option', () => {
        expect(
          crushinator.crush(uncrushed, {
            blur: { radius: 6, sigma: 3 },
          }),
        ).toEqual(`${crushed}?blur=6%2C3`);
      });

      test('should support blur with sigma only', () => {
        expect(
          crushinator.crush(uncrushed, {
            blur: 4,
          }),
        ).toEqual(`${crushed}?blur=0%2C4`);
      });

      test('should support blur as a boolean', () => {
        expect(
          crushinator.crush(uncrushed, {
            blur: true,
          }),
        ).toEqual(`${crushed}?blur=0%2C2`);
      });

      test('should recognize global gamma correction', () => {
        expect(
          crushinator.crush(uncrushed, {
            gamma: 1.2,
          }),
        ).toEqual(`${crushed}?gamma=1.2`);
      });

      test('should recognize channel-specific gamma correction', () => {
        expect(
          crushinator.crush(uncrushed, {
            gamma: { red: 1.2, green: 1.3, blue: 1.4 },
          }),
        ).toEqual(`${crushed}?gamma=1.2%2C1.3%2C1.4`);

        expect(
          crushinator.crush(uncrushed, {
            gamma: { green: 1.3 },
          }),
        ).toEqual(`${crushed}?gamma=1%2C1.3%2C1`);
      });

      test('should recognize the grayscale option', () => {
        expect(
          crushinator.crush(uncrushed, {
            grayscale: 0.9,
          }),
        ).toEqual(`${crushed}?grayscale=90`);

        expect(
          crushinator.crush(uncrushed, {
            grayscale: true,
          }),
        ).toEqual(`${crushed}?grayscale=100`);
      });

      test('should recognize the unsharp option', () => {
        expect(
          crushinator.crush(uncrushed, {
            unsharp: { radius: 1.4, sigma: 0.7, amount: 0.8, threshold: 0.5 },
          }),
        ).toEqual(
          `${crushed}?u%5Br%5D=1.4&u%5Bs%5D=0.7&u%5Ba%5D=0.8&u%5Bt%5D=0.5`,
        );

        expect(
          crushinator.crush(uncrushed, {
            unsharp: true,
          }),
        ).toEqual(
          `${crushed}?u%5Br%5D=2&u%5Bs%5D=0.5&u%5Ba%5D=0.8&u%5Bt%5D=0.03`,
        );
      });
    });
  });
});
