import express, { NextFunction, Request, Response }  from "express";
import morgan  from "morgan";
import cors  from 'cors'
import cookieParser from 'cookie-parser';
import productRouter  from "./routes/productsRoutes"
import config  from "./utlis/config"
import customerRouter from "./routes/customersRoutes";
import userRouter from "./routes/usersRoutes";
import protectedComponentsRouter from "./routes/protectedComponentsRoutes";
import pdfRouter from "./routes/pdfRoutes";

// Initialize Express ---
const app = express()

// To parse JSON body
app.use(express.json())

//  To parse FORM data
app.use(express.urlencoded({ extended: true }))

const allowedOrigins = [config.localhost_backend_server_3001, config.localhost_frontend_server_5173, config.localhost_frontend_server_5174, config.localhost_frontend_server_5175, config.publicIP, config.production_frontend_website, config.production_backend, config.uat_backend, config.elasticIp, config.dev_backend];

// use cors middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow the origin if it matches one in the allowedOrigins array
      callback(null, true);
    } else {
      // Deny the request if the origin is not allowed
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
}));

// use cookie parser middleware
app.use(cookieParser());

// For logging
app.use(morgan('dev'))


app.use('/api/products', productRouter)
app.use('/api/customers', customerRouter)
app.use('/api/users', userRouter)
app.use('/api/auth', protectedComponentsRouter)
app.use('/api/createinvoice', pdfRouter)


export default app;