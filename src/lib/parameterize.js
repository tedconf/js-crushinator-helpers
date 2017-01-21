/**
Convert options to a parameters object.
*/

import * as crop from './crop-option';
import { fit } from './fit-option';
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
