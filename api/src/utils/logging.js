/**
 * Logs an error message to the console and throws an error.
 *
 * @param {string} logMessage - The message to log to the console.
 * @param {string} errorMessage - The message for the thrown error.
 * @throws {Error} Throws an error with the provided errorMessage or logMessage.
 */
export const logErrorAndThrow = (logMessage, errorMessage) => {
	console.error(logMessage)
	throw new Error(errorMessage || logMessage)
}
