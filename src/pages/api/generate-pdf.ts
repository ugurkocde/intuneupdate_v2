/* import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import AWS from "aws-sdk";

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: "YOUR_AWS_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_AWS_SECRET_ACCESS_KEY",
  region: "YOUR_AWS_REGION",
});

const s3 = new AWS.S3();

export default async function generatePDF(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { title, content } = req.body;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(content);

    const pdf = await page.pdf();

    await browser.close();

    // Generate a unique filename for the PDF
    const fileName = `${title}-${Date.now()}.pdf`;

    // Save the PDF file to AWS S3 bucket
    await s3
      .putObject({
        Bucket: "YOUR_S3_BUCKET_NAME",
        Key: fileName,
        Body: pdf,
        ContentType: "application/pdf",
      })
      .promise();

    // Generate the download link
    const downloadLink = s3.getSignedUrl("getObject", {
      Bucket: "YOUR_S3_BUCKET_NAME",
      Key: fileName,
      Expires: 3600, // Link expiration time in seconds
    });

    res.status(200).json({ downloadLink });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "PDF generation failed" });
  }
}
 */
