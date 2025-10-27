import express from 'express'
import { deleteUser, updateUser } from '../controllers/user.controllers.js'
import { isAuthenticated } from '../middlewares/AuthUser.js'

const router = express.Router()

router.post('/update/:id',isAuthenticated,updateUser)
router.delete('/delete/:id',isAuthenticated,deleteUser)


export default router