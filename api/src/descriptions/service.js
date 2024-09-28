import { ObjectId } from 'bson'
import mongoDBClient from '../mongo/mongoDBClient.js'
import { logErrorAndThrow } from '../utils/logging.js'
import imagesService from '../images/service.js'

import { COLLECTIONS } from '../constants/mongo.js'

/**
 * Creates new descriptions with the given name in both, motors and animations collections.
 *
 * @param {string} name - The name of the new descriptions to be created.
 * @throws Will throw if the name already exists in either the motors or animations collections or if there are errors in database operations.
 */
const create = async function (name) {
	const motorsCollection = await mongoDBClient.getCollection(
		COLLECTIONS.MOTORS_DESCRIPTION
	)
	const animationsCollection = await mongoDBClient.getCollection(
		COLLECTIONS.ANIMATIONS_DESCRIPTION
	)
	let motorsNames
	let animationsNames

	// find description names
	try {
		motorsNames = (await motorsCollection.find({}).toArray()).map(
			({ name }) => name
		)
		animationsNames = (await animationsCollection.find({}).toArray()).map(
			({ name }) => name
		)
	} catch (err) {
		logErrorAndThrow(err.stack, 'Error occurred while creating descriptions')
	}

	// check that the name is not repeated
	if (
		motorsNames.some((motorName) => motorName === name) ||
		animationsNames.some((animationName) => animationName === name)
	) {
		throw new Error('Name already exists')
	}

	// save new descriptions
	try {
		await motorsCollection.insertOne({ name, motors: [] })
		await animationsCollection.insertOne({ name, animations: [] })
	} catch (err) {
		logErrorAndThrow(err.stack, 'Error occurred while creating descriptions')
	}
}

/**
 * Deletes descriptions and associated images by name.
 *
 * @param {string} name - The name of the descriptions to delete.
 * @throws Will throw an error if there is an issue deleting the descriptions.
 */
const deleteByName = async function (name) {
	const motorsDescription = await findByName(
		name,
		COLLECTIONS.MOTORS_DESCRIPTION
	)
	const animationsDescription = await findByName(
		name,
		COLLECTIONS.ANIMATIONS_DESCRIPTION
	)

	// delete images
	try {
		const idsToDelete = []
		motorsDescription?.motors?.forEach((m) => {
			const propsWithImages = ['neutralPosition', 'maxPosition', 'minPosition']
			propsWithImages.forEach((prop) => {
				if (m?.[prop]?.images) {
					idsToDelete.push(...m[prop].images)
				}
			})
		})
		animationsDescription?.animations?.forEach((a) => {
			if (a?.images) {
				idsToDelete.push(...a.images)
			}
		})
		await imagesService.deleteMany(idsToDelete)
	} catch (err) {
		console.error('Error occurred while deleting images:', err.stack)
	}

	// delete descriptions
	try {
		const motorsCollection = await mongoDBClient.getCollection(
			COLLECTIONS.MOTORS_DESCRIPTION
		)
		const animationsCollection = await mongoDBClient.getCollection(
			COLLECTIONS.ANIMATIONS_DESCRIPTION
		)
		await motorsCollection.deleteOne({ name })
		await animationsCollection.deleteOne({ name })
	} catch (err) {
		logErrorAndThrow(err.stack, 'Error occurred while deleting descriptions')
	}
}

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
 * @throws {Error} - Throws an error if there is an issue with the database operation or if the document is not found.
 */
const findByName = async function (name, collectionName) {
	const collection = await mongoDBClient.getCollection(collectionName)
	let description

	try {
		description = await collection.findOne({ name })
	} catch (err) {
		logErrorAndThrow(err.stack, `Could not get description ${name}`)
	}

	if (!description) {
		throw new Error(`Description ${name} not found`)
	}

	return description
}

/**
 * Saves an item in the specified description.
 *
 * @param {string} descriptionName - The name of the description to update.
 * @param {Object} item - The item to save.
 * @param {string} collectionName - The name of the collection containing the description.
 * @returns {Promise<Object>} The updated description.
 * @throws {Error} Will throw an error if the item name is repeated, the item has no motions (for animations), or if an error occurs during the save.
 */
const saveItem = async function (descriptionName, item, collectionName) {
	const description = await findByName(descriptionName, collectionName)

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
		const collection = await mongoDBClient.getCollection(collectionName)
		await collection.updateOne(
			{ name: descriptionName },
			{ $set: { ...description, [listProp]: items } }
		)
	} catch (err) {
		logErrorAndThrow(err.stack, 'Error occurred while saving description')
	}

	// delete old images
	try {
		if (oldItem) {
			if (collectionName === COLLECTIONS.MOTORS_DESCRIPTION) {
				const deleteFn = async (prop) => {
					const oldImages = oldItem?.[prop]?.images || []
					const images = item?.[prop]?.images || []
					if (oldImages.length) {
						await deleteOldImages(oldImages, images)
					}
				}
				await Promise.all([
					deleteFn('neutralPosition'),
					deleteFn('minPosition'),
					deleteFn('maxPosition'),
				])
			} else {
				const oldImages = oldItem?.images || []
				const images = item?.images || []
				if (oldImages.length) {
					await deleteOldImages(oldImages, images)
				}
			}
		}
	} catch (err) {
		console.error('Error occurred while deleting old images:', err.stack)
	}

	// return updated description
	return await findByName(descriptionName, collectionName)
}

/**
 * Deletes an item from a specified description.
 *
 * @param {string} descriptionName - The name of the description to update.
 * @param {string} itemId - The ID of the item to delete.
 * @param {string} collectionName - The name of the collection containing the description.
 * @returns {Promise<Object>} - The updated description.
 * @throws Will throw an error if there is an issue saving the updated description.
 */
const deleteItem = async function (descriptionName, itemId, collectionName) {
	const description = await findByName(descriptionName, collectionName)

	const listProp =
		collectionName === COLLECTIONS.MOTORS_DESCRIPTION ? 'motors' : 'animations'

	let items = description[listProp] || []
	items = items.filter(({ id }) => id !== itemId)

	// save updated description
	try {
		const collection = await mongoDBClient.getCollection(collectionName)
		await collection.updateOne(
			{ name: descriptionName },
			{ $set: { ...description, [listProp]: items } }
		)
	} catch (err) {
		logErrorAndThrow(err.stack, 'Error occurred while saving description')
	}

	// delete old images
	try {
		const item = description[listProp].find(({ id }) => id === itemId)
		if (collectionName === COLLECTIONS.MOTORS_DESCRIPTION) {
			const deleteFn = async (prop) => {
				if (item?.[prop]?.images) {
					await imagesService.deleteMany(item[prop].images)
				}
			}
			await Promise.all([
				deleteFn('neutralPosition'),
				deleteFn('minPosition'),
				deleteFn('maxPosition'),
			])
		} else {
			if (item?.images) {
				await imagesService.deleteMany(item.images)
			}
		}
	} catch (err) {
		console.error('Error occurred while deleting images:', err.stack)
	}

	// return updated description
	return await findByName(descriptionName, collectionName)
}

/**
 * Deletes old images that are not present in the new image IDs.
 *
 * @param {Array<string>} oldImageIds - An array of old image IDs.
 * @param {Array<string>} newImageIds - An array of new image IDs.
 * @returns {Promise<void>} A promise that resolves when the images have been deleted.
 */
const deleteOldImages = async function (oldImageIds, newImageIds) {
	const idsToDelete = oldImageIds.filter(
		(oldId) => !newImageIds.includes(oldId)
	)

	if (idsToDelete.length) {
		await imagesService.deleteMany(idsToDelete)
	}
}

export default {
	allDescriptionNames,
	create,
	deleteByName,
	deleteItem,
	findByName,
	namesByAssembly,
	saveItem,
}
