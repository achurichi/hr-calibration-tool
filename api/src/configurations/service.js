import mongoDBClient from '../mongo/mongoDBClient.js'
import { logErrorAndThrow } from '../utils/logging.js'

/**
 * Finds a document in the specified collection by description name and assembly.
 *
 * @param {string} descriptionName - The name of the description to search for.
 * @param {string} assembly - The assembly to search for.
 * @param {string} collectionName - The name of the collection to search in.
 * @returns {Promise<Object|null>} The found document, or null if no document matches the criteria.
 * @throws Will throw an error if there is an issue with the database query.
 */
const findByDescriptionAndAssembly = async function (
	descriptionName,
	assembly,
	collectionName
) {
	const collection = await mongoDBClient.getCollection(collectionName)

	try {
		return await collection.findOne({ descriptionName, assembly })
	} catch (err) {
		logErrorAndThrow(
			`Error occurred while getting configuration: ${err.message}`,
			`Could not get configuration with descriptionName ${descriptionName} and assembly ${assembly}`
		)
	}
}

export default {
	findByDescriptionAndAssembly,
}
