/**
ParamBuilder option .
*/

'use strict';

import {prepNumber} from './preppers';

export function fit(options) {
  const params = {};

  if (options.fit && options.width && options.height) {
    Object.assign(params, {
      op: '^',
      gravity: 'c',
      c: (
        prepNumber(options.width) + ',' +
        prepNumber(options.height)
      ),
    });
  }

  return params;
}

export default fit;
