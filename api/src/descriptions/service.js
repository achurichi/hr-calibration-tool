import mongoDBClient from '../mongo/mongoDBClient.js'
import { logErrorAndThrow } from '../utils/logging.js'

import { COLLECTIONS } from '../constants/mongo.js'

/**
 * Retrieves description names for the given assemblies.
 *
 * @param {Array<string>} assemblies - An array of assembly names.
 * @returns {Promise<Object>} A promise that resolves to an object mapping each assembly to its description name.
 * @throws Will throw an error if there is an issue retrieving the configurations.
 */
const namesByAssembly = async function (assemblies) {
	const collection = await mongoDBClient.getCollection(
		COLLECTIONS.MOTORS_CONFIGURATION
	)

	const assemblyNameMap = assemblies.reduce(
		(acc, assembly) => ({ ...acc, [assembly]: null }),
		{}
	)

	// Find description names from configurations
	try {
		const configurations = await collection
			.find({ assembly: { $in: assemblies } })
			.toArray()
		configurations.forEach((config) => {
			assemblyNameMap[config.assembly] = config.descriptionName
		})
	} catch (err) {
		logErrorAndThrow(
			err.stack,
			`Could not get description names for assemblies`
		)
	}

	return assemblyNameMap
}

/**
 * Retrieves all description names.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of description names.
 * @throws Will throw an error if there is an issue retrieving the descriptions.
 */
const allDescriptionNames = async function () {
	const collection = await mongoDBClient.getCollection(
		COLLECTIONS.MOTORS_DESCRIPTION
	)

	try {
		return (await collection.find({}).toArray()).map(({ name }) => name)
	} catch (err) {
		logErrorAndThrow(err.stack, 'Could not get descriptions')
	}
}

/**
 * Finds a document by its name in the specified collection.
 *
 * @param {string} name - The name of the document to find.
 * @param {string} collectionName - The name of the collection to search in.
 * @returns {Promise<Object|null>} - A promise that resolves to the found document or null if not found.
 * @throws {Error} - Throws an error if there is an issue with the database operation.
 */
const findByName = async function (name, collectionName) {
	const collection = await mongoDBClient.getCollection(collectionName)

	try {
		return await collection.findOne({ name })
	} catch (err) {
		logErrorAndThrow(err.stack, `Could not get description ${name}`)
	}
}

export default {
	allDescriptionNames,
	findByName,
	namesByAssembly,
}
