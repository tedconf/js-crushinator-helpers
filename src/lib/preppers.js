/**
Methods used by stringifyOptions to prepare Crushinator option
values.
*/

'use strict';

import {warn} from './log';

/**
Prepare a numerical Crushinator option.
*/
export function prepNumber(options, optionName) {
  const incoming = options[optionName];
  let outgoing = Number(incoming);

  if (!isFinite(outgoing)) {
    warn(`${optionName} value "${incoming}" is not a finite number`);
    outgoing = 0;
  }

  return outgoing;
}
