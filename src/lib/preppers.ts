/**
 * Methods used to prepare Crushinator option values for parameterization,
 * mostly concerning typecasting and type-checking with application of
 * default values.
 */

import { error } from './log';

/**
 * Returns true if the value is undefined, null, or false.
 * @param value - Value to test for emptiness.
 */
export function isBlank(value: any): boolean {
  return typeof value === 'undefined' || value === null || value === false;
}

/**
 * Prepare a boolean value.
 *
 * @param value - Value that should be typecast as a boolean.
 */
export function prepBoolean(
  value: any,
  defaultValue: boolean = false,
): boolean {
  return typeof value === 'undefined' ? defaultValue : !!value;
}

/**
 * Prepare a numerical value.
 * @param value - Value that should be typecast as a number.
 * @returns the resulting number
 */
export function prepNumber(value: any, defaultValue: number = 0): number {
  let outgoing = value;

  // Boolean true evaluates to 1 numerically
  if (value === true) {
    outgoing = defaultValue || 1;
  }

  if (isBlank(value)) {
    outgoing = defaultValue;
  }

  // Cast values numerically
  outgoing = Number(outgoing);

  if (!Number.isFinite(outgoing)) {
    error(`"${value}" is not a finite number`);
    outgoing = defaultValue;
  }

  return outgoing;
}
