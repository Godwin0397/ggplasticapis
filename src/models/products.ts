import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productName: "string",
    productURL: "string",
    type: "string"
})

export default mongoose.model("Products", productSchema, "products")