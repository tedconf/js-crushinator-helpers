/**
ParamBuilder option for the Crushinator crop controller.
*/

'use strict';

import {prepNumber} from './preppers';

export function param(values) {
  return values.crop.afterResize ? 'c' : 'precrop';
}

export function filter(values) {
  const cropValues = values.crop;

  const width = prepNumber(cropValues, 'width');
  const height = prepNumber(cropValues, 'height');

  let data = `${width},${height}`;

  if (cropValues.hasOwnProperty('x') || cropValues.hasOwnProperty('y')) {
    const x = prepNumber(cropValues, 'x');
    const y = prepNumber(cropValues, 'y');

    data += `,${x},${y}`;
  }

  return data;
}
