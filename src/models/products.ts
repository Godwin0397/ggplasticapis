import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productName: "string",
    productURL: "string",
    type: "string"
}, {timestamps: true})

productSchema.index({createdAt: -1})
productSchema.index({type: 1, createdAt: -1})
productSchema.index({productName: "text"})
productSchema.index({productURL: 1}, {unique: true})

export default mongoose.model("Products", productSchema, "products")