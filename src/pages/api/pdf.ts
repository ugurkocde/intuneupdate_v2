import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core"; // use puppeteer-core instead of puppeteer
import chromium from "chrome-aws-lambda"; // add this line

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query.url as string;

  if (!url) {
    res.status(400).send("Bad Request: No url specified");
    return;
  }

  let browser = null;

  try {
    // Use the chromium version from chrome-aws-lambda package and puppeteer-core
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    const pdf = await page.pdf({ format: "a4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdf.length.toString());
    res.setHeader("Content-Disposition", `attachment; filename="blog.pdf"`);
    res.send(pdf);
  } catch (error) {
    const e = error as Error;
    res.status(500).send(`Error: ${e.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
