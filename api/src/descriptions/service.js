import mongoDBClient from '../mongo/mongoDBClient.js'
import { logErrorAndThrow } from '../utils/logging.js'

const namesByAssembly = async function (assemblies) {
	const collection = await mongoDBClient.getCollection(
		'calibMotorsConfiguration'
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
			`Error occurred while getting configurations: ${err.message}`,
			`Could not get description names for assemblies`
		)
	}

	return assemblyNameMap
}

export default {
	namesByAssembly,
}
