const express = require('express')
const productsController = require('../controllers/productsController')
const multer = require("multer");

const productRouter = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
 });

// defining the endpoints
productRouter.get('/', productsController.allProducts)
productRouter.post('/create',  upload.array("images", 10), productsController.addProducts)

module.exports = productRouter