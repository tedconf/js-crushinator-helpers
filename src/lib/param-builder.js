'use strict';

import {serialize} from './query-string';

export class ParamBuilder {
  constructor(options) {
    this.options = options;
  }

  /**
  Returns parameters in object form.
  */
  get(values) {
    const params = {};

    for (const key in this.options) {
      if (values.hasOwnProperty(key)) {
        const model = this.options[key];
        const value = model.filter(values, key);
        const param = (
          typeof model.param === 'function' ?
          model.param(values, key) : model.param
        );

        params[param] = value;
      }
    }

    return params;
  }

  /**
  Returns parameters in query string form.
  */
  serialize(values) {
    return serialize(this.get(values));
  }
}

export default ParamBuilder;