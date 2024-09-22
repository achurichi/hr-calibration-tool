import express from 'express'
import handlers from './handlers.js'

const router = express.Router()

router.get('/', handlers.findByName)

export default router
