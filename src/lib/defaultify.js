/**
Add defaults to a Crushinator helper options object,
unless explicitly requested not to do so.
*/

import { prepBoolean } from './preppers';

/**
Default Crushinator helper options.
*/
const defaultOptions = {
  fit: true,
  align: 'top',
  unsharp: true,
  quality: 82,
};

/**
Given a list of options returns those options seeded with the defaults
specified above unless the "defaults" option is set to false.

@param {Object} [options] - Incoming Crushinator helper options.
@returns {Object}
*/
export function defaultify(options = {}) {
  return Object.assign({}, (
    prepBoolean(options.defaults, true) ? defaultOptions : {}
  ), options);
}

export default defaultify;
