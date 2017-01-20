/**
Convert options to a parameters object.
*/

'use strict';

import * as crop from './crop-option';
import {fit} from './fit-option';
import {dehyphenate} from './dehyphenate';
import {prepNumber} from './preppers';

export function parameterize(options) {
  const params = {};

  options = dehyphenate(options);

  for (const option in options) {
    if (options.hasOwnProperty(option)) {
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

        case 'crop':
          params[crop.param(value)] = crop.filter(value);
          break;

        case 'query':
          Object.assign(params, value || {});
          break;

        default:
          break;
      }
    }
  }

  return params;
}

export default parameterize;
