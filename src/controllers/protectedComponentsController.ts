import User from "../models/customers";

import { Request, Response } from "express";


const protectedComponentsController = {
    validUser: async (req: Request, res: Response) => { 
        try {
            res.status(201).json({ message: "Valid User"});
           
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

}

export default protectedComponentsController