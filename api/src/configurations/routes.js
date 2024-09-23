import express from 'express'
import animationsRouter from './animations/routes.js'
import motorsRouter from './motors/routes.js'

const router = express.Router()

router.use('/animations', animationsRouter)
router.use('/motors', motorsRouter)

export default router
