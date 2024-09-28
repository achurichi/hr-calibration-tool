import express from 'express'
import configurationsRouter from './configurations/routes.js'
import descriptionsRouter from './descriptions/routes.js'
import imagesRouter from './images/routes.js'

const router = express.Router()

router.use('/configurations', configurationsRouter)
router.use('/descriptions', descriptionsRouter)
router.use('/images', imagesRouter)

export default router
