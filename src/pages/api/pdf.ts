// Path: src\pages\api\pdf.ts

import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query.url as string;

  if (!url) {
    res.status(400).send("Bad Request: No url specified");
    return;
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdf.length.toString());
    res.setHeader("Content-Disposition", `attachment; filename="blog.pdf"`);
    res.send(pdf);
  } catch (error) {
    // Cast the error to the Error type
    const e = error as Error;
    res.status(500).send(`Error: ${e.message}`);
  }
}
