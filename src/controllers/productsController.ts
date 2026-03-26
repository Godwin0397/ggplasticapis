import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from '../utlis/config';
import products from "../models/products";
import { Request, Response } from "express";
import getFileDetails from "../utlis/getFileDetails";




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
            const allProducts = await products.find({type: "Product"}).select("-__v -_id").lean()
            res.status(200).json({ allProducts });
        }
        catch (e: any) {
            res.status(500).json({ message: e.message })
        }
    },
    addProducts: async (req: Request, res: Response) => {
        try {
            const files = req.files as Express.Multer.File[];

            if (!files.length) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            // ✅ single file upload function
            const uploadFile = async (file: any) => {
                try {
                    const { type, productName } = getFileDetails(file.originalname);

                    const fileName = file.originalname.replace(/\s+/g, "");

                    const params = {
                        Bucket: config.AWS_Bucket_Name,
                        Key: fileName,
                        Body: file.buffer,
                        ContentType: file.mimetype
                    };

                    await s3.send(new PutObjectCommand(params));

                    const fileUrl = `https://${config.AWS_Bucket_Name}.s3.${config.AWS_Region}.amazonaws.com/${fileName}`;

                    const newProduct = new products({
                        productName,
                        productURL: fileUrl,
                        type
                    });

                    return await newProduct.save();

                } catch (error) {
                    console.error("Upload failed:", file.originalname, error);
                    return null; // prevent full failure
                }
            };

            // ✅ controlled parallel execution
            const BATCH_SIZE = 5;
            const results: any[] = [];

            for (let i = 0; i < files.length; i += BATCH_SIZE) {
                const batch = files.slice(i, i + BATCH_SIZE);

                const uploadedBatch = await Promise.all(
                    batch.map(uploadFile)
                );

                results.push(...uploadedBatch);
            }

            // remove failed uploads
            const uploadedUrls = results.filter(Boolean);

            res.json({
                message: "Images uploaded successfully",
                count: uploadedUrls.length,
                urls: uploadedUrls
            });

        } catch (e: any) {
            console.error("Error in addProducts:", e);
            res.status(500).json({ message: e.message });
        }
    }
}

export default productsController