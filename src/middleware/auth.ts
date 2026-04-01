import jwt from "jsonwebtoken";
import config from "../utlis/config";

import { NextFunction, Request, Response } from "express";

interface AuthRequest extends Request {
  userId?: string;
}

interface JwtPayload {
  id: string;
}

const authMiddleware = {
  isAuth: (req: AuthRequest, res: Response, next: NextFunction) => {
    // get the token from the request headers
    const token = req.cookies.token;
    console.log("Token from cookies:", token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // verify the token
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      req.userId = decoded.id;
      next();
    } catch (error: any) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
};

export default authMiddleware;