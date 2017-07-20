/**
Given an options object, returns the parameters .
*/

import { prepNumber } from './preppers';

export function unsharp(options) {
  const params = {};
  const value = options.unsharp;

  if (value) {
    Object.assign(params, { u: {
      r: prepNumber(value.radius, 2),
      s: prepNumber(value.sigma, 0.5),
      a: prepNumber(value.amount, 0.8),
      t: prepNumber(value.threshold, 0.03),
    } });
  }

  return params;
}

export default unsharp;
