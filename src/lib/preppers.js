/**
Methods used by stringifyOptions to prepare Crushinator option
values.
*/

import { error } from './log';

/**
Returns true if the value is undefined, null, or false.

@param {*} value - Value to test for emptiness.
@returns {boolean}
*/
export function isBlank(value) {
  return (
    typeof value === 'undefined' ||
    value === null ||
    value === false
  );
}

/**
Prepare a numerical value.

@param {*} value - Value that should be typecast as a number.
@returns {number}
*/
export function prepNumber(value, fallback = 0) {
  let outgoing = isBlank(value) ? fallback : Number(value);

  if (!isFinite(outgoing)) {
    error(`"${value}" is not a finite number`);
    outgoing = fallback;
  }

  return outgoing;
}

export default undefined;
