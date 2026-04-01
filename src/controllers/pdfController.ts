import { Request, Response } from "express";
import generatePdfAndUpload from "../services/pdfService";
import Invoices from "../models/invoice";
import counter from "../models/counter";
import invoice from "../models/invoice";


const createInvoice = {
    generateBill: async (req: Request, res: Response) => {
        try {
            console.log("request came")
            const round = (num: number) => Number(num.toFixed(2));

            const items = (req.body.items || []).map((item: any) => {
                const total = item.qty * item.price;
                return {
                    name: item.name,
                    qty: item.qty,
                    price: item.price,
                    total: round(total)
                };
            });

            // ✅ Subtotal
            const subtotal = items.reduce(
                (sum: number, item: any) => sum + item.total,
                0
            );

            // ✅ Discount
            const discount = req.body.discount || 0;

            // ✅ Subtotal after discount
            const subtotalLessDiscount = subtotal - discount;

            // ✅ Combined Tax (18%)
            const tax = (subtotalLessDiscount * 18) / 100;

            // ✅ Shipping (optional)
            const shipping = req.body.shipping || 0;

            // ✅ Grand Total
            const grandTotal = req.body.gstType ? subtotalLessDiscount + tax + shipping : subtotalLessDiscount + shipping;

            const counterData = await counter.findOneAndUpdate(
                { name: "invoice" },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );

            const newinvoiceNo = counterData.value;
            console.log("newinvoiceNo", newinvoiceNo)

            // ✅ Final Data Object
            const data = {
                // Invoice Info
                invoiceNo: newinvoiceNo || "INV-" + Date.now(),
                date: new Date().toLocaleDateString("en-GB"),
                terms: req.body.terms || 0,
                gstType: req.body.gstType,

                // Company Details
                companyName: req.body.companyName,
                companyAddress: req.body.companyAddress,
                companyCity: req.body.companyCity,
                companyState: req.body.companyState,
                companyPincode: req.body.companyPincode,
                companyGST: req.body.companyGST,
                companyPhone: req.body.companyPhone,

                // Customer Details
                customerName: req.body.customerName,
                customerAddress: req.body.customerAddress,
                customerCity: req.body.customerCity,
                customerState: req.body.customerState,
                customerPincode: req.body.customerPincode,
                customerGST: req.body.customerGST,

                // Items
                items,

                // Calculations
                subtotal,
                discount,
                subtotalLessDiscount,
                tax,
                shipping,
                grandTotal
            };
            console.log("genearting pdf to store in s3")
            const pdfUrl = await generatePdfAndUpload(data);
            console.log("genearting pdf done")

            console.log("storing url in db")
            const saved = await Invoices.create({
                name: data.invoiceNo,
                pdfUrl,
                date: data.date
            });
            console.log("url stored in db")


            res.json({
                message: "PDF generated & uploaded",
                pdfUrl,
                data: saved
            });

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    exportInvoice: async (req: Request, res: Response) => {
        try {
            const { fromDate, toDate } = req.body;

            const from = new Date(fromDate);
            const to = new Date(toDate);

            // 🔥 include full day for toDate
            to.setHours(23, 59, 59, 999);

            const exportDocuments = await invoice.find({
                createdAt: {
                    $gte: from,
                    $lte: to
                }
            }).select("-__v -_id -createdAt -updatedAt").lean();

            res.status(200).json({ exportDocuments });

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}


export default createInvoice;