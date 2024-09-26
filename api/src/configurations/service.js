import mongoDBClient from '../mongo/mongoDBClient.js'
import { logErrorAndThrow } from '../utils/logging.js'
import { COLLECTIONS } from '../constants/mongo.js'

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
			err.stack,
			`Could not get configuration with descriptionName ${descriptionName} and assembly ${assembly}`
		)
	}
}

const save = async function (descriptionName, assembly, item, collectionName) {
	const collection = await mongoDBClient.getCollection(collectionName)
	let configuration

	try {
		configuration = await collection.findOne({ descriptionName, assembly })
	} catch (err) {
		logErrorAndThrow(
			err.stack,
			`Could not get configuration with descriptionName ${descriptionName} and assembly ${assembly}`
		)
	}

	const listProp =
		collectionName === COLLECTIONS.MOTORS_CONFIGURATION
			? 'motors'
			: 'animations'

	// If the configuration object doesn't exist create a new one
	if (!configuration) {
		configuration = {
			descriptionName,
			assembly,
			[listProp]: [],
		}
	}

	let items = configuration[listProp] || []

	// Update configuration items list
	const index = items.findIndex((i) => i.descId === item.descId)
	if (index === -1) {
		items.push(item)
	} else {
		items[index] = item
	}

	// Save updated configuration
	try {
		await collection.updateOne(
			{ descriptionName, assembly },
			{ $set: { ...configuration, [listProp]: items } },
			{ upsert: true }
		)
	} catch (err) {
		logErrorAndThrow(err.stack, `Error occurred while saving configuration`)
	}

	// Get updated configuration
	try {
		return await collection.findOne({ descriptionName, assembly })
	} catch (err) {
		logErrorAndThrow(err.stack, `Error occurred while retrieving configuration`)
	}
}

export default {
	findByDescriptionAndAssembly,
	save,
}
