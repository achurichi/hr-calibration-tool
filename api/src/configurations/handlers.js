import httpStatus from 'http-status'

import configurationsService from './service.js'

const createMany = async (req, res) => {
	const { items } = req.body

	try {
		await configurationsService.createMany(items)
		return res.status(httpStatus.OK).send()
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
	}
}

export default {
	createMany,
}
