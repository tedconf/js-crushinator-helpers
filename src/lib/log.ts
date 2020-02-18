/* eslint-disable import/prefer-default-export */
/**
 * Wrapper methods for logging errors and other notices.
 */

/**
 * Throw an honest-to-goodness error.
 * @param message - A human-readable description of the error
 */
export function error(message: string): void {
  throw new Error(message);
}
/* eslint-enable import/prefer-default-export */
