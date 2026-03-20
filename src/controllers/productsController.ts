import { S3Client, PutObjectCommand }  from "@aws-sdk/client-s3";
import config  from '../utlis/config';
import products  from "../models/products";
import { Request, Response } from "express";



const s3 = new S3Client({
    region: config.AWS_Region,
    credentials: {
        accessKeyId: config.AWS_Access_Key,
        secretAccessKey: config.AWS_Secret_Key,
    },
});

const productsController = {
    allProducts: async (req:Request, res:Response) => {
        try {
            const allProducts = await products.find().select("-__v -_id")
            res.status(200).json({ allProducts });
        }
        catch (e:any) {
            res.status(500).json({ message: e.message })
        }
    },

    addProducts: async (req:Request, res:Response) => {
        try {
            const files:any = req.files;

            const uploads = files.map(async (file:any) => {

                let type = "Other";
                let productName = file.originalname;

                if (file.originalname.includes("Product")) {
                    productName = file.originalname.split(" Product")[0];
                    type = "Product";
                } else if (file.originalname.includes("Machine")) {
                    productName = file.originalname.split(" Machine")[0];
                    type = "Machine";
                } else {
                    productName = file.originalname.split("Other")[0];
                }

                const fileName = file.originalname.replace(/\s+/g, "");


                const params = {
                    Bucket: config.AWS_Bucket_Name,
                    Key: fileName,
                    Body: file.buffer,
                    ContentType: file.mimetype
                };

                await s3.send(new PutObjectCommand(params));

                // generate file URL
                const fileUrl = `https://${config.AWS_Bucket_Name}.s3.${config.AWS_Region}.amazonaws.com/${fileName}`;

                const newProduct = new products({
                    productName,
                    productURL: fileUrl,
                    type
                });

                return await newProduct.save();
            });

            const uploadedUrls = await Promise.all(uploads);

            res.json({
                message: "Images uploaded successfully",
                urls: uploadedUrls
            });
        }
        catch (e:any) {
            res.status(500).json({ message: e.message })
        }
    }
}

export default productsController