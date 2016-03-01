/**
ParamBuilder option for the Crushinator crop controller.
*/

'use strict';

import {prepNumber} from './preppers';

export function param(cropOptions) {
  return cropOptions.afterResize ? 'c' : 'precrop';
}

export function filter(cropOptions) {
  const data = [];

  data.push(prepNumber(cropOptions.width));
  data.push(prepNumber(cropOptions.height));

  if (
    cropOptions.hasOwnProperty('x') ||
    cropOptions.hasOwnProperty('y')
  ) {
    data.push(prepNumber(cropOptions.x));
    data.push(prepNumber(cropOptions.y));
  }

  return data.join(',');
}
