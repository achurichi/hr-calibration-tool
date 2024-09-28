import httpStatus from 'http-status'

import descriptionsService from './service.js'

const create = async (req, res) => {
	const { name } = req.body

	try {
		await descriptionsService.create(name)
		return res.status(httpStatus.OK).send()
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
	}
}

const deleteByName = async (req, res) => {
	const { name } = req.query

	try {
		await descriptionsService.deleteByName(name)
		return res.status(httpStatus.OK).send()
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
	}
}

const allDescriptionNames = async (req, res) => {
	try {
		const descriptionNames = await descriptionsService.allDescriptionNames()
		return res.status(httpStatus.OK).send(descriptionNames)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.mesage)
	}
}

const namesByAssembly = async (req, res) => {
	const { assemblies } = req.body

	try {
		const nameMap = await descriptionsService.namesByAssembly(assemblies)
		return res.status(httpStatus.OK).send(nameMap)
	} catch (err) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.mesage)
	}
}

export default {
	allDescriptionNames,
	create,
	deleteByName,
	namesByAssembly,
}
