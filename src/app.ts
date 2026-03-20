import express, { NextFunction, Request, Response }  from "express";
import morgan  from "morgan";
import cors  from 'cors'
import productRouter  from "./routes/productsRoutes"
import config  from "./utlis/config"

const app = express()

// To parse JSON body
app.use(express.json())

//  To parse FORM data
app.use(express.urlencoded())

// For logging
app.use(morgan('dev'))

const allowedOrigins = [config.localhost_backend_server_3001, config.localhost_frontend_server_5173, config.localhost_frontend_server_5174, config.localhost_frontend_server_5175];

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

app.use('/api/products', productRouter)

app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
  res.status(500).json({ error: err.message });
});

export default app;