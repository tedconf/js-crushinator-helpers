/**
Wrapper methods for logging errors and other notices.
*/

/**
True if we can send messages to the console.
*/
const isConsolable = typeof console === 'object';

/**
Throw an honest-to-goodness error.
*/
export function error(message) {
  throw new Error(message);
}

/**
Display a warning without throwing a script-halting error.
*/
export function warn(message) {
  if (isConsolable && typeof console.warn === 'function') {
    console.warn(message);
  }
}
