/**
 * Logs an error to the console and throws an error.
 *
 * @param {any} log - The message to log to the console.
 * @param {string} errorMessage - The message for the thrown error.
 * @throws {Error} Throws an error with the provided errorMessage
 */
export const logErrorAndThrow = (log, errorMessage) => {
  console.error(log);
  throw new Error(errorMessage);
};
