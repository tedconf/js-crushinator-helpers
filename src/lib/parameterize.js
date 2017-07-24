/**
Convert helper options to Crushinator URL parameters.
*/

import * as crop from './crop-option';
import { fit } from './fit-option';
import { unsharp } from './unsharp-option';
import { dehyphenate } from './dehyphenate';
import { prepNumber } from './preppers';

export function parameterize(incoming) {
  const params = {};
  const options = dehyphenate(incoming);

  Object.keys(options).forEach((option) => {
    const value = options[option];

    switch (option) {
      case 'width':
        params.w = prepNumber(value);
        break;

      case 'height':
        params.h = prepNumber(value);
        break;

      case 'quality':
        params.quality = prepNumber(value);
        break;

      case 'fit':
        Object.assign(params, fit(options));
        break;

      case 'align':
        params.gravity = {
          top: 'n',
          left: 'w',
          center: 'c',
          middle: 'c',
          right: 'e',
          bottom: 's',
        }[value] || 'c';
        break;

      case 'crop':
        params[crop.param(value)] = crop.filter(value);
        break;

      case 'blur':
        params.blur = (
          typeof value === 'object' ?
          `${prepNumber(value.radius)},${prepNumber(value.sigma, 2)}` :
          `0,${prepNumber(value, 2)}`
        );
        break;

      case 'gamma':
        params.gamma = (
          typeof value === 'object' ?
          `${prepNumber(value.red, 1)},${prepNumber(value.green, 1)},${prepNumber(value.blue, 1)}` :
          prepNumber(value, 1)
        );
        break;

      case 'grayscale':
      case 'greyscale':
        params.grayscale = prepNumber(value, 1) * 100;
        break;

      case 'unsharp':
        Object.assign(params, unsharp(options));
        break;

      case 'query':
        Object.assign(params, value || {});
        break;

      default:
        break;
    }
  });

  return params;
}

export default parameterize;
