import Users from "../models/users";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  config from "../utlis/config";

import { Request, Response } from "express";


const usersController = {
    register: async (req: Request, res: Response) => { 
        try {
            // get the user data from the request body
            const { username, password, location } = req.body;
            // check if the user already exists
            const user = await Users.findOne({ username });
            if (user) {
                return res.status(400).json({ message: "User already exists" });
            }

            // hash the password
            const saltRounds = 10;
            const hashedPassword = await bycrypt.hash(password, saltRounds);

            // create a new user
            const newUser = new Users({
                username,
                password: hashedPassword,
                location
            });
            // save the user to the database    
           const savedUser = await newUser.save();
            // return the saved user
            res.status(201).json({ message: "User Created Successfully", user: savedUser});
           
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            // get the user data from the request body
            const { username, password } = req.body;
            console.log("Test Log")
            // check if the user exists
            const user = await Users.findOne<any>({username});
            
            // check if the user doesn't exist, return error
            if (!user) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }

            // compare the password with the hashed password
            const isMatch = await bycrypt.compare(password, user.password);
            
            // check if the password doesn't match, return error
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }

            // create a token for the user
            const token = jwt.sign({ id: user._id.toString(), 
                username:user.username,
                location: user.location }, config.JWT_SECRET, {
                expiresIn: "3h",
            });

            // set a cookie with the token
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 3 * 60 * 60 * 1000, // 3 hours
            });

            res.json({ message: "login successful", token });

        } catch (error: any)
         {
            res.status(500).json({ message: error.message });
        }
    },

    logout: async (req: Request, res: Response) => {
        try {
            // clear the cookie
            res.clearCookie("token", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });
            res.status(200).json({ message: "Logout successful" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default usersController