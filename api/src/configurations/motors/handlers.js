import httpStatus from 'http-status'

import configurationsService from '../service.js'

import { COLLECTIONS } from '../../constants/mongo.js'

const findByDescriptionAndAssembly = async (req, res) => {
	const { descriptionName, assembly } = req.query

	try {
		const configuration =
			await configurationsService.findByDescriptionAndAssembly(
				descriptionName,
				assembly,
				COLLECTIONS.MOTORS_CONFIGURATION
			)
		return res.status(httpStatus.OK).send(configuration)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
	}
}

const saveItem = async (req, res) => {
	const { descriptionName, assembly, motor } = req.body

	try {
		const configuration = await configurationsService.saveItem(
			descriptionName,
			assembly,
			motor,
			COLLECTIONS.MOTORS_CONFIGURATION
		)
		return res.status(httpStatus.OK).send(configuration)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
	}
}

export default {
	findByDescriptionAndAssembly,
	saveItem,
}
