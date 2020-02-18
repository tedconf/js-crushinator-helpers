/**
Given an options object, returns a parameters object with crop
parameters included according to the specified options.
*/

import { prepNumber } from './preppers';

/*
 * @param width - Width of cropped section in pixels.
 * @param height - Height of cropped section in pixels.
 * @param x - Coordinate at which to start crop (pixels from left.)
 * @param y - Coordinate at which to start crop (pixels from top.)
 * @param afterResize - If true, crop will take place after the image has been resized.
 */
export type CropOptions = Partial<{
  afterResize: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
}>;

export function param(cropOptions: CropOptions): string {
  return cropOptions.afterResize ? 'c' : 'precrop';
}

export function filter(cropOptions: CropOptions): string {
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
