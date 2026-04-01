import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    name: String,
    pdfUrl: String,
    date: String
}, { timestamps: true });

invoiceSchema.index({createdAt: -1})
invoiceSchema.index({date: 1, createdAt: -1})

export default mongoose.model("Invoices", invoiceSchema, "invoices");