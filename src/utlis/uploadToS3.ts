import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../utlis/config";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
    region: config.AWS_Region,
    credentials: {
        accessKeyId: config.AWS_Access_Key,
        secretAccessKey: config.AWS_Secret_Key,
    },
});

interface UploadOptions {
    file?: Express.Multer.File;
    buffer?: Buffer;
    fileName?: string;
    mimeType?: string;
    folder?: string;
}

const uploadToS3 = async ({
    file,
    buffer,
    fileName,
    mimeType,
    folder = "uploads"
}: UploadOptions) => {
    try {
        let body: Buffer;
        let contentType: string;
        let finalFileName: string;

        // ✅ Case 1: Multer file
        if (file) {
            body = file.buffer;
            contentType = file.mimetype;
            finalFileName = file.originalname;
        }

        // ✅ Case 2: Buffer (PDF, etc.)
        else if (buffer && fileName && mimeType) {
            body = buffer;
            contentType = mimeType;
            finalFileName = fileName;
        }

        else {
            throw new Error("Invalid upload input");
        }

        const key = finalFileName.replace(/\s+/g, "");

        await s3.send(new PutObjectCommand({
            Bucket: file ? config.AWS_Bucket_Name01 : config.AWS_Bucket_Name02,
            Key: key,
            Body: body,
            ContentType: contentType
        }));

        return `https://${file ? config.AWS_Bucket_Name01 : config.AWS_Bucket_Name02}.s3.${config.AWS_Region}.amazonaws.com/${key}`;

    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw error;
    }
};

export default uploadToS3;