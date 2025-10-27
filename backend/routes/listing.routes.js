import express from 'express'
import { isAuthenticated } from '../middlewares/AuthUser.js'
import { create } from '../controllers/listing.controllers.js'

const router = express.Router()

router.post('/create',isAuthenticated,create)

export default router