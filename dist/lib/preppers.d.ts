/**
 * Methods used to prepare Crushinator option values for parameterization,
 * mostly concerning typecasting and type-checking with application of
 * default values.
 */
/**
 * Returns true if the value is undefined, null, or false.
 * @param value - Value to test for emptiness.
 */
export declare function isBlank(value: any): boolean;
/**
 * Prepare a boolean value.
 *
 * @param value - Value that should be typecast as a boolean.
 */
export declare function prepBoolean(value: any, defaultValue?: boolean): boolean;
/**
 * Prepare a numerical value.
 * @param value - Value that should be typecast as a number.
 * @returns the resulting number
 */
export declare function prepNumber(value: any, defaultValue?: number): number;
