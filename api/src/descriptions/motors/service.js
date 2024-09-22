import mongoDBClient from '../../mongo/mongoDBClient.js'
import { logErrorAndThrow } from '../../utils/logging.js'

const findByName = async function (name) {
	const collection = await mongoDBClient.getCollection('calibMotorsDescription')

	try {
		return await collection.findOne({ name })
	} catch (err) {
		logErrorAndThrow(
			`Error occurred while getting description: ${err.message}`,
			`Could not get description ${name}`
		)
	}
}

export default {
	findByName,
}
