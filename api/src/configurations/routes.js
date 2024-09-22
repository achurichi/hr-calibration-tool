import express from 'express'
import motorsRouter from './motors/routes.js'

const router = express.Router()

router.use('/motors', motorsRouter)

export default router
