import express from 'express'
import motorsRouter from './motors/routes.js'
import handlers from './handlers.js'

const router = express.Router()

router.use('/motors', motorsRouter)

router.post('/namesByAssembly', handlers.namesByAssembly)

export default router
