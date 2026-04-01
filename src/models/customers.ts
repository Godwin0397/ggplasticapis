import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
    customerName: "string",
    phone: "string",
    email: "string",
    gst: "string",
    address: "string",
    pincode: "string",
    city: "string",
    state: "string",
}, {timestamps: true})

customerSchema.index({createdAt: -1})
customerSchema.index({customerName: 1, createdAt: -1})

export default mongoose.model("Customers", customerSchema, "customers")