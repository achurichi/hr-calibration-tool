import mongoDBClient from '../../mongo/mongoDBClient.js'
import { logErrorAndThrow } from '../../utils/logging.js'

const findByDescriptionAndAssembly = async function (
	descriptionName,
	assembly
) {
	const collection = await mongoDBClient.getCollection(
		'calibMotorsConfiguration'
	)

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
