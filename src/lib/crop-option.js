/**
Given an options object, returns a parameters object with crop
parameters included according to the specified options.
*/

import { prepNumber } from './preppers';

export function param(cropOptions) {
  return cropOptions.afterResize ? 'c' : 'precrop';
}

export function filter(cropOptions) {
  const data = [];

  data.push(prepNumber(cropOptions.width));
  data.push(prepNumber(cropOptions.height));

  if (
    Object.prototype.hasOwnProperty.call(cropOptions, 'x') ||
    Object.prototype.hasOwnProperty.call(cropOptions, 'y')
  ) {
    data.push(prepNumber(cropOptions.x));
    data.push(prepNumber(cropOptions.y));
  }

  return data.join(',');
}
