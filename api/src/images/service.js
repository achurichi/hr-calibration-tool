import { ObjectId } from 'bson'
import mongoDBClient from '../mongo/mongoDBClient.js'
import { logErrorAndThrow } from '../utils/logging.js'

import { COLLECTIONS } from '../constants/mongo.js'

/**
 * Finds an image by its ID.
 *
 * @param {string} id - The ID of the image to find.
 * @returns {Promise<Object|null>} A promise that resolves to the image object if found, or null if not found.
 * @throws Will throw an error if the image could not be retrieved.
 */
const findById = async function (id) {
	const collection = await mongoDBClient.getCollection(COLLECTIONS.IMAGE)

	try {
		return await collection.findOne({ _id: new ObjectId(id) })
	} catch (err) {
		logErrorAndThrow(err.stack, `Could not get image id ${id}`)
	}
}

/**
 * Saves a base64 encoded image to the database and retrieves the saved image.
 *
 * @param {string} base64 - The base64 encoded image to be saved.
 * @returns {Promise<Object>} The saved image document from the database.
 * @throws Will throw an error if the image cannot be saved or retrieved.
 */
const save = async function (base64) {
	const collection = await mongoDBClient.getCollection(COLLECTIONS.IMAGE)

	let insertResult

	try {
		insertResult = await collection.insertOne({ base64 })
	} catch (err) {
		logErrorAndThrow(err.stack, 'Could not save image')
	}

	try {
		return await collection.findOne({ _id: insertResult.insertedId })
	} catch (err) {
		logErrorAndThrow(err.stack, 'Error occurred while retrieving saved image')
	}
}

/**
 * Deletes multiple images from the database based on the provided IDs.
 *
 * @param {Array<string>} ids - An array of image IDs to be deleted.
 * @returns {Promise<Object>} - The result of the deleteMany operation.
 * @throws Will throw an error if the deletion process fails.
 */
const deleteMany = async function (ids) {
	const collection = await mongoDBClient.getCollection(COLLECTIONS.IMAGE)

	try {
		const query = { _id: { $in: ids.map((id) => new ObjectId(id)) } }
		return await collection.deleteMany(query)
	} catch (err) {
		logErrorAndThrow(err.stack, 'Could not delete images')
	}
}

export default {
	deleteMany,
	findById,
	save,
}
