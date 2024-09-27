import { ObjectId } from 'bson'
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

/**
 * Saves an item to the specified collection and updates the description.
 *
 * @param {string} descriptionName - The name of the description to update.
 * @param {Object} item - The item to save.
 * @param {string} collectionName - The name of the collection to update.
 * @returns {Promise<Object>} The updated description.
 * @throws {Error} If the description is not found, the item name is repeated, the item has no motions (for animations), or if an error occurs during the save or retrieval process.
 */
const saveItem = async function (descriptionName, item, collectionName) {
	const collection = await mongoDBClient.getCollection(collectionName)
	let description

	try {
		description = await collection.findOne({ name: descriptionName })
	} catch (err) {
		logErrorAndThrow(err.stack, `Could not get description ${descriptionName}`)
	}

	if (!description) {
		throw new Error(`Description ${descriptionName} not found`)
	}

	const listProp =
		collectionName === COLLECTIONS.MOTORS_DESCRIPTION ? 'motors' : 'animations'

	let items = description[listProp] || []
	let oldItem = items.find(({ id }) => id === item.id)
	if (oldItem) {
		// deep copy to keep the old item values in case it is updated
		oldItem = JSON.parse(JSON.stringify(oldItem))
	}

	// check that the item name is not repeated
	if (items.some(({ name, id }) => name === item.name && id !== item.id)) {
		throw new Error('Name already exists')
	}

	// for animations, motions should be processed
	if (collectionName === COLLECTIONS.ANIMATIONS_DESCRIPTION) {
		// check that the item has at least one motion
		if (!item.motions?.length) {
			throw new Error('Must have at least one motion')
		}

		// add id to new motions
		item.motions = item.motions.map((m) =>
			m.id ? m : { id: new ObjectId().toString(), ...m }
		)
	}

	// update items list
	if (!item.id) {
		items.push({ id: new ObjectId().toString(), ...item })
	} else {
		const index = items.findIndex(({ id }) => id === item.id)
		if (index === -1) {
			items.push(item)
		} else {
			items[index] = item
		}
	}

	// save updated description
	try {
		await collection.updateOne(
			{ name: descriptionName },
			{ $set: { ...description, [listProp]: items } }
		)
	} catch (err) {
		logErrorAndThrow(err.stack, `Error occurred while saving description`)
	}

	// delete old images
	try {
		if (oldItem) {
			if (collectionName === COLLECTIONS.MOTORS_DESCRIPTION) {
				const deleteOldImages = async (prop) => {
					const oldImages = oldItem?.[prop]?.images || []
					const images = item?.[prop]?.images || []
					if (oldImages.length) {
						// await context.functions.execute('images_deleteOld', oldImages, images)
					}
				}
				await Promise.all([
					deleteOldImages('neutralPosition'),
					deleteOldImages('minPosition'),
					deleteOldImages('maxPosition'),
				])
			} else {
				const oldImages = oldItem?.images || []
				const images = item?.images || []
				if (oldImages.length) {
					// await context.functions.execute('images_deleteOld', oldImages, images)
				}
			}
		}
	} catch (err) {
		console.error('Error occurred while deleting old images:', err.message)
	}

	// get updated configuration
	try {
		return await collection.findOne({ name: descriptionName })
	} catch (err) {
		logErrorAndThrow(err.stack, `Error occurred while retrieving description`)
	}
}

export default {
	allDescriptionNames,
	findByName,
	namesByAssembly,
	saveItem,
}
