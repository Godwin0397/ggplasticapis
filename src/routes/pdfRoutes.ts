import express from "express";
import createInvoice from "../controllers/pdfController";
import authMiddleware from '../middleware/auth'

const pdfRouter = express.Router();

pdfRouter.post("/", authMiddleware.isAuth, createInvoice.generateBill);
pdfRouter.post("/export", authMiddleware.isAuth, createInvoice.exportInvoice);

export default pdfRouter;