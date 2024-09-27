import httpStatus from 'http-status'

import descriptionService from './service.js'

const allDescriptionNames = async (req, res) => {
	try {
		const descriptionNames = await descriptionService.allDescriptionNames()
		return res.status(httpStatus.OK).send(descriptionNames)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.mesage)
	}
}

const namesByAssembly = async (req, res) => {
	const { assemblies } = req.body

	try {
		const nameMap = await descriptionService.namesByAssembly(assemblies)
		return res.status(httpStatus.OK).send(nameMap)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.mesage)
	}
}

export default {
	allDescriptionNames,
	namesByAssembly,
}
