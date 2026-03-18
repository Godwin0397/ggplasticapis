const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: "string",
    productURL: "string",
    type: "string"
})

module.exports = mongoose.model("Products", productSchema, "products")