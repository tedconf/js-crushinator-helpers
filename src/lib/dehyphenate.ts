/**
 * Convert values from hyphenated form to an object tree, e.g.:
 * ```
 * dehyphenate({
 *   'cat-ears': 'pointy',
 *   'cat-tail': 'whippy',
 *   'dog-ears': 'floppy',
 *   'dog-tail': 'swishy',
 * })
 * // => {
 * //      cat: { ears: 'pointy', tail: 'whippy' },
 * //      dog: { ears: 'floppy', 'tail: 'swishy' },
 * //    }
 * ```
 */
import { CrushConfig } from './crush-config';

export function dehyphenate(values: CrushConfig): Record<any, any> {
  const dehyphenated = {};

  Object.keys(values).forEach((key: any) => {
    // @ts-ignore
    const value: any = values[key];
    const splitted = key.match(/([^-]+)-+(.*)/);

    if (splitted) {
      // @ts-ignore
      dehyphenated[splitted[1]] = dehyphenated[splitted[1]] || {};
      // @ts-ignore
      dehyphenated[splitted[1]][splitted[2]] = value;
    } else {
      // @ts-ignore
      dehyphenated[key] = value;
    }
  });

  return dehyphenated;
}

export default dehyphenate;
