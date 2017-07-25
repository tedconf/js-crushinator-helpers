/**
Given an options object, returns the parameters required to
resize the image for best fit if applicable.
*/

import { prepNumber } from './preppers';

export function fit(options) {
  const params = {};

  if (options.fit && options.width && options.height) {
    Object.assign(params, {
      op: '^',
      c: `${prepNumber(options.width)},${prepNumber(options.height)}`,
    });

    // A custom alignment may be specified with the fit option
    if (!options.align) params.gravity = 't';
  }

  return params;
}

export default fit;
