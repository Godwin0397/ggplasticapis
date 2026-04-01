import express from 'express'
import customersController from '../controllers/customersController'
import authMiddleware from '../middleware/auth'


const customerRouter = express.Router()

// defining the endpoints
customerRouter.get('/', authMiddleware.isAuth, customersController.allCustomers)
customerRouter.post('/create', authMiddleware.isAuth, customersController.addCustomer)

export default customerRouter