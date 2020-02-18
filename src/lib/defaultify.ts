/**
Add defaults to a Crushinator helper options object,
unless explicitly requested not to do so.
*/

import { prepBoolean } from './preppers';
import { CrushConfig } from './crush-config';

/**
 * Default Crushinator helper options.
 */
const defaultOptions = {
  fit: true,
  unsharp: true,
  quality: 82,
};

/**
 * Given a list of options returns those options seeded with the defaults
 * specified above unless the "defaults" option is set to false.

 * @param options - Incoming Crushinator helper options.
 */
export function defaultify(
  options: CrushConfig = { defaults: true },
): CrushConfig {
  return Object.assign(
    {},
    prepBoolean(options.defaults, true) ? defaultOptions : {},
    options,
  );
}

export default defaultify;
