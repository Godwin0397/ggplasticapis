import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from '../utlis/config';
import products from "../models/products";
import { Request, Response } from "express";
import getFileDetails from "../utlis/getFileDetails";
import uploadToS3 from "../utlis/uploadToS3";




const s3 = new S3Client({
    region: config.AWS_Region,
    credentials: {
        accessKeyId: config.AWS_Access_Key,
        secretAccessKey: config.AWS_Secret_Key,
    },
});

const productsController = {
    allProducts: async (req: Request, res: Response) => {
        try {
            const allProducts = await products.find({ type: "Product" }).select("-__v -_id -createdAt -updatedAt").lean()
            res.status(200).json({ allProducts });
        }
        catch (e: any) {
            res.status(500).json({ message: e.message })
        }
    },
    addProducts: async (req: Request, res: Response) => {
        try {
            const files = req.files as Express.Multer.File[];

            if (!files?.length) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const uploadFile = async (file: Express.Multer.File) => {
                try {
                    const { type, productName } = getFileDetails(file.originalname);

                    // ✅ reuse common function
                    const fileUrl = await uploadToS3({
                        file
                    });

                    const newProduct = new products({
                        productName,
                        productURL: fileUrl,
                        type
                    });

                    return await newProduct.save();

                } catch (error) {
                    console.error("Upload failed:", file.originalname, error);
                    return null;
                }
            };

            const BATCH_SIZE = 5;
            const results: any[] = [];

            for (let i = 0; i < files.length; i += BATCH_SIZE) {
                const batch = files.slice(i, i + BATCH_SIZE);

                const uploadedBatch = await Promise.all(
                    batch.map(uploadFile)
                );

                results.push(...uploadedBatch);
            }

            const uploadedUrls = results.filter(Boolean);

            res.json({
                message: "Images uploaded successfully",
                count: uploadedUrls.length,
                data: uploadedUrls
            });

        } catch (e: any) {
            console.error("Error in addProducts:", e);
            res.status(500).json({ message: e.message });
        }
    }
}

export default productsController