/**
Wrapper methods for handling errors.
*/

'use strict';

/**
True if we can send messages to the console.
*/
const isConsolable = typeof console === 'object';

/**
Display a warning without throwing a script-halting error.
*/
export function warn(message) {
  if (isConsolable && typeof console.warn === 'function') {
    console.warn('Crushinator: ' + message);
  }
}
