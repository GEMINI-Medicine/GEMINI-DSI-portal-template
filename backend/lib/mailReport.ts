import { getTestMessageUrl } from "nodemailer";

import { FROM, getHtmlTemplate, transport } from "./mail";
import { EmailData, SiteData, TagData } from "./types";
import path from "path";

export async function sendReportPublished(
  reportName: string,
  site: SiteData,
  tags: [TagData],
  emails: [EmailData],
): Promise<void> {
  const isIRP = tags.find((tag) => tag.name.toLowerCase() === "irp");

  const isGRP = tags.find((tag) => tag.name.toLowerCase() === "grp");

  let htmlTemplate = "";

  if (isIRP) {
    // Get the absolute path to the HTML template file
    htmlTemplate = await getHtmlTemplate("IRPReportPublished.html");
  } else {
    htmlTemplate = await getHtmlTemplate("ReportPublished.html");
  }

  // Define the loginURL
  const url = process.env.FRONTEND_URL;

  const search = "{{URL}}";
  const replacer = new RegExp(search, "g");
  // Populate the template with the name variable
  let html = htmlTemplate.replace(replacer, url);

  const title_without_extension = path.basename(
    reportName,
    path.extname(reportName),
  );

  html = html.replace(new RegExp("{{report}}", "g"), title_without_extension);

  let type = "";
  if (isIRP) {
    type = "(IndividualReport)";
  } else if (isGRP) {
    type = "(GroupReport)";
  }

  if (isIRP && isGRP) {
    type = "";
  }

  const subject =
    "Report published " +
    type +
    ": " +
    "General Medicine report from " +
    site?.name;

  for (let index = 0; index < emails.length; index++) {
    // Send the email
    const info = await transport.sendMail({
      to: emails[index].email,
      from: FROM,
      subject: subject,
      html: html,
    });
    if (process.env.MAIL_USER?.includes("ethereal.email")) {
      console.log(`� Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
    }
  }
}
