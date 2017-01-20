'use strict';

import {dehyphenate} from './dehyphenate';

export class ParamBuilder {

  /**
  Constructor method.
  */
  constructor(options) {
    this.options = options;
  }

  /**
  Returns parameters in object form.
  */
  get(values) {
    const params = {};

    // Convert "crop-width" to crop.width etc.
    values = dehyphenate(values);

    for (const key in this.options) {
      if (values.hasOwnProperty(key)) {
        const model = this.options[key];
        const value = values[key];
        const param = (
          typeof model.param === 'function' ?
          model.param(value) : model.param
        );

        params[param] = model.filter(value);
      }
    }

    return params;
  }

}

export default ParamBuilder;
