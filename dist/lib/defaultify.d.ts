/**
Add defaults to a Crushinator helper options object,
unless explicitly requested not to do so.
*/
import { CrushConfig } from './crush-config';
/**
 * Given a list of options returns those options seeded with the defaults
 * specified above unless the "defaults" option is set to false.

 * @param options - Incoming Crushinator helper options.
 */
export declare function defaultify(options?: CrushConfig): CrushConfig;
export default defaultify;
