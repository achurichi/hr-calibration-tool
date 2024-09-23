import httpStatus from 'http-status'

import descriptionsService from '../service.js'

import { COLLECTIONS } from '../../constants/mongo.js'

const findByName = async (req, res) => {
	const { name } = req.query

	if (!name) {
		return res.status(httpStatus.BAD_REQUEST).send('name is required')
	}

	try {
		const description = await descriptionsService.findByName(
			name,
			COLLECTIONS.ANIMATIONS_DESCRIPTION
		)
		return res.status(httpStatus.OK).send(description)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
	}
}

export default {
	findByName,
}
