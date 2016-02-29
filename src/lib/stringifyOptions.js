/**
Library to convert Crushinator options from a POJO to a String.
*/

'use strict';

import {prepNumber} from './optionPreppers';

/**
Possible options parameters for Crushinator.
*/
const validOptions = {
  width: { param: 'w', filter: prepNumber },
  height: { param: 'h', filter: prepNumber },
  quality: { param: 'quality', filter: prepNumber },
};

/**
Converts options from a POJO to a string.
*/
export default function stringifyOptions(options) {
  const queryParams = [];

  for (const key in validOptions) {
    if (options.hasOwnProperty(key)) {
      const validOption = validOptions[key];
      const value = validOption.filter(options, key);

      queryParams.push(
        validOption.param + '=' +
        encodeURIComponent(value)
      );
    }
  }

  return queryParams.join('&');
}
