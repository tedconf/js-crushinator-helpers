'use strict';

export class ParamBuilder {

  /**
  Constructor method.
  */
  constructor(options) {
    this.options = options;
  }

  /**
  Convert values from hyphenated form to an object tree.
  */
  dehyphenate(values) {
    const dehyphenated = {};

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        const value = values[key];
        const splitted = key.match(/([^-]+)-+(.*)/);

        if (splitted && this.options.hasOwnProperty(splitted[1])) {
          dehyphenated[splitted[1]] = dehyphenated[splitted[1]] || {};
          dehyphenated[splitted[1]][splitted[2]] = value;
        } else {
          dehyphenated[key] = value;
        }
      }
    }

    return dehyphenated;
  }

  /**
  Returns parameters in object form.
  */
  get(values) {
    const params = {};

    // Convert "crop-width" to crop.width etc.
    values = this.dehyphenate(values);

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
