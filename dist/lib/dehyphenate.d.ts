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
export declare function dehyphenate(values: CrushConfig): Record<any, any>;
export default dehyphenate;
