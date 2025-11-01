import express from 'express'
import { isAuthenticated } from '../middlewares/AuthUser.js'
import { create, deleteListing, getListings, updateListing } from '../controllers/listing.controllers.js'

const router = express.Router()

router.post('/create',isAuthenticated,create)
router.delete('/delete/:id',isAuthenticated,deleteListing)
router.put('/update/:id',isAuthenticated,updateListing)
router.get('/get/:id',getListings)

export default router