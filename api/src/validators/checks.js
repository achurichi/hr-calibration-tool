import { check } from 'express-validator'

export const descriptionNameCheck = check('descriptionName')
	.notEmpty()
	.withMessage('descriptionName is required')

export const assemblyCheck = check('assembly')
	.notEmpty()
	.withMessage('assembly is required')

export const motorCheck = check('motor')
	.notEmpty()
	.withMessage('motor is required')

export const animationCheck = check('animation')
	.notEmpty()
	.withMessage('animation is required')
