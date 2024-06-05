import { getTestMessageUrl } from "nodemailer";

import { FROM, getHtmlTemplate, makeANiceEmail, transport } from "./mail";

export async function sendMagicAuthLink(
  loginToken: string,
  to: string,
): Promise<void> {
  const htmlTemplate = await getHtmlTemplate("MagicAuthLink.html");

  // Define the magicURL
  const magicURL =
    process.env.FRONTEND_URL + "/redeem?token=" + loginToken + "&email=" + to;

  const search = "{{magicURL}}";
  const replacer = new RegExp(search, "g");

  // Populate the template with the loginToken variable
  const html = htmlTemplate.replace(replacer, magicURL);

  const info = await transport.sendMail({
    to,
    from: FROM,
    subject: "Your one-time authentication link!",
    html: html,
  });

  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`� Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string,
): Promise<void> {
  // email the user a token
  const info = await transport.sendMail({
    to,
    from: FROM,
    subject: "Your password reset token!",
    html: makeANiceEmail(`Your Password Reset Token is here!
        <a href = "${process.env.FRONTEND_URL}/reset?token=${resetToken}"> Click Here to reset </a>`),
  });
  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`� Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}
