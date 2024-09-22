import httpStatus from 'http-status'

import descriptionService from './service.js'

const namesByAssembly = async (req, res) => {
	const { assemblies } = req.body

	if (
		!Array.isArray(assemblies) ||
		assemblies.some((a) => typeof a !== 'string')
	) {
		return res
			.status(httpStatus.BAD_REQUEST)
			.send('assemblies is required and must be an array of strings')
	}

	try {
		const nameMap = await descriptionService.namesByAssembly(assemblies)
		return res.status(httpStatus.OK).send(nameMap)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.mesage)
	}
}

export default {
	namesByAssembly,
}
