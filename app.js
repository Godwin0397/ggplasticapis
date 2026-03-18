const express = require("express")
const morgan = require("morgan")
const cors = require('cors');
const productRouter = require("./routes/productsRoutes")

const app = express()

// To parse JSON body
app.use(express.json())

//  To parse FORM data
app.use(express.urlencoded())

// For logging
app.use(morgan('dev'))

const allowedOrigins = ['http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174', 'https://backend-s4v5.onrender.com', 'https://your-production-site.com'];

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

app.use((err, req, res, next) => {
  console.error("Multer error:", err);
  res.status(500).json({ error: err.message });
});

module.exports = app