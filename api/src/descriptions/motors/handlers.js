import httpStatus from 'http-status'

import descriptionsService from '../service.js'

import { COLLECTIONS } from '../../constants/mongo.js'

const findByName = async (req, res) => {
	const { name } = req.query

	try {
		const description = await descriptionsService.findByName(
			name,
			COLLECTIONS.MOTORS_DESCRIPTION
		)
		return res.status(httpStatus.OK).send(description)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
	}
}

const saveItem = async (req, res) => {
	const { descriptionName, motor } = req.body

	try {
		const description = await descriptionsService.saveItem(
			descriptionName,
			motor,
			COLLECTIONS.MOTORS_DESCRIPTION
		)
		return res.status(httpStatus.OK).send(description)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
	}
}

export default {
	findByName,
	saveItem,
}
