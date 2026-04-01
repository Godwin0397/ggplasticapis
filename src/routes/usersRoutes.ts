import express from 'express'
import usersController from '../controllers/usersController'


const userRouter = express.Router()

// defining the endpoints
userRouter.post('/register', usersController.register)
userRouter.post('/login', usersController.login)
userRouter.post('/logout', usersController.logout)

export default userRouter