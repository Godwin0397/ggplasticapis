import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import axios from "axios";
import uploadToS3 from "../utlis/uploadToS3";

const generatePdfAndUpload = async (data: any) => {
    console.log("generatePdfAndUpload function called");

    // ✅ STEP 1: Fetch S3 image and convert to base64
    const imageUrl =
        "https://ggplastics3bucket01.s3.ap-south-2.amazonaws.com/DevicemarkOther.jpeg";

    const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
    });

    const logoBase64 = Buffer.from(response.data, "binary").toString("base64");

    // ✅ Attach base64 image
    const finalData = {
        ...data,
        logo: `data:image/jpeg;base64,${logoBase64}`,
    };

    // ✅ STEP 2: Load HBS template
    const templatePath = path.join(__dirname, "../templates/invoice.hbs");
    const htmlFile = fs.readFileSync(templatePath, "utf8");

    const template = handlebars.compile(htmlFile);
    const html = template(finalData);

    console.log("HTML ready");

    // ✅ STEP 3: Launch Puppeteer
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // ✅ Prevent timeout issues
    await page.setDefaultTimeout(20000);

    // ✅ Load HTML (NO networkidle0 ❌)
    await page.setContent(html, {
        waitUntil: "domcontentloaded",
    });

    // ✅ Small delay for rendering safety
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Page loaded");

    // ✅ STEP 4: Generate PDF
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20px",
            bottom: "20px",
            left: "10px",
            right: "10px",
        },
    });

    await browser.close();

    console.log("PDF generated");

    // ✅ STEP 5: Upload to S3
    const pdfUrl = await uploadToS3({
        buffer: Buffer.from(pdfBuffer),
        fileName: `${data.invoiceNo}.pdf`,
        mimeType: "application/pdf",
        folder: "invoices",
    });

    console.log("Uploaded to S3");

    return pdfUrl;
};

export default generatePdfAndUpload;