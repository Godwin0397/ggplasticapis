import customers from "../models/customers";

import { Request, Response } from "express";


const customersController = {
    allCustomers: async (req: Request, res: Response) => {
        try {
            const allCustomers = await customers.find().select("-__v -_id -createdAt -updatedAt").lean()
            res.status(200).json({ allCustomers });
        }
        catch (e: any) {
            res.status(500).json({ message: e.message })
        }
    },
    addCustomer: async (req: Request, res: Response) => {
        try {
            const { customerName, phone, email, gst, address, pincode, city, state } = req.body

            const customer = await customers.findOne({ customerName });

            if (customer) {
                return res.status(400).json({ message: "Customer already exists" });
            }

            // create a new customer
            const newCustomer = new customers({
                customerName, phone, email, gst, address, pincode, city, state
            });
            // save the customer to the database    
            const savedCustomer = await newCustomer.save();
            // return the saved Customer
            res.status(201).json({ message: `${savedCustomer.customerName} Created Successfully`, customer: savedCustomer });

        } catch (e: any) {
            console.error("Error in addCustomers:", e);
            res.status(500).json({ message: e.message });
        }
    }
}

export default customersController