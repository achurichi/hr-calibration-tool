import httpStatus from 'http-status'

import motorsConfigurationsService from './service.js'

const findByDescriptionAndAssembly = async (req, res) => {
	const { descriptionName, assembly } = req.query

	if (!descriptionName) {
		return res
			.status(httpStatus.BAD_REQUEST)
			.send('descriptionName is required')
	}
	if (!assembly) {
		return res.status(httpStatus.BAD_REQUEST).send('assembly is required')
	}

	try {
		const configuration =
			await motorsConfigurationsService.findByDescriptionAndAssembly(
				descriptionName,
				assembly
			)
		return res.status(httpStatus.OK).send(configuration)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
	}
}

export default {
	findByDescriptionAndAssembly,
}
