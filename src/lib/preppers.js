/**
Methods used by stringifyOptions to prepare Crushinator option
values.
*/

'use strict';

import {error} from './log';

/**
Prepare a numerical value.

@param {*} value - Value that should be typecast as a number.
@returns {number}
*/
export function prepNumber(value) {
  let outgoing = Number(value);

  if (!isFinite(outgoing)) {
    error(`"${value}" is not a finite number`);
    outgoing = 0;
  }

  return outgoing;
}
