import { createTransport } from "nodemailer";
import { promisify } from "util";
import fs from "fs";
import path from "path";

export const transport = createTransport({
  // @ts-ignore
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const READFILE = promisify(fs.readFile);

export const FROM = process.env.MAIL_FROM;
export const TO_ADMIN = process.env.MAIL_TO_ADMIN;

export function makeANiceEmail(text: string) {
  return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</p>
    </div>
  `;
}

export async function getHtmlTemplate(fileName: string) {
  // Get the absolute path to the HTML template file
  const templatePath = path.join(__dirname, "../email_templates", fileName);

  // Read the HTML template file
  const htmlTemplate = await READFILE(templatePath, "utf8");

  return htmlTemplate;
}
