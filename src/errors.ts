/** Used to ensure error so that non-Error-typed values that are thrown can be typed and handled as errors consistently. */
export class WrappedError extends Error {
  /** More reliable way to determine type than instanceOf (in case it gets serialized/deserialized). */
  public type = "WrappedError";

  /**
   * Create a new instance.
   *
   * @param originalValue - original/non-Error valued value
   * @param message - optional custom message; will include original value in message for ease of use/logging
   */
  constructor(public originalValue: unknown, message?: string) {
    super(message ?? `Wrapped: ${originalValue}`);
  }
}

/**
 * Ensures the given value is an Error instance for easier handling with TypeScript.
 *
 * @param possibleError - a value (usually from a catch) that may or may not be an Error instance
 * @returns - the original `Error` instance or a `WrappedError`, if value is not an Error instance
 */
export const ensureError = (possibleError: unknown): Error =>
  possibleError instanceof Error
    ? possibleError
    : new WrappedError(possibleError);
