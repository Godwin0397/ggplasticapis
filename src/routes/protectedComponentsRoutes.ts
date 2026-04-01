import express from 'express'
import protectedComponentsController from '../controllers/protectedComponentsController'
import authMiddleware from '../middleware/auth'


const protectedComponentsRouter = express.Router()

// defining the endpoints
protectedComponentsRouter.get('/', authMiddleware.isAuth, protectedComponentsController.validUser)

export default protectedComponentsRouter