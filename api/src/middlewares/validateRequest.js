import { validationResult } from 'express-validator'
import httpStatus from 'http-status'

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() })
	}
	next()
}

export default validateRequest
