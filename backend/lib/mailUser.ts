import { getTestMessageUrl } from "nodemailer";

import {
  FROM,
  TO_ADMIN,
  getHtmlTemplate,
  makeANiceEmail,
  transport,
} from "./mail";
import { UserData } from "./types";

export async function sendUserSignedUpEmailToAdmin(
  newUser: UserData,
): Promise<void> {
  const info = await transport.sendMail({
    to: TO_ADMIN,
    from: FROM,
    subject: `User with email ${newUser.email} has signed up on the Portal`,
    html: makeANiceEmail(`New User Signed up!
    <h3>User Details</h3>
    <hr/>
    <ul>
      <li>name: ${newUser.name}</li>
      <li>email: ${newUser.email}</li>
      <li>cpso: ${newUser.cpso}</li>
    </ul>
    <hr/>
      `),
  });
  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`� Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}

export async function sendRegistrationConfirmationEmail(
  newUser: UserData,
): Promise<void> {
  // Get the absolute path to the HTML template file
  const htmlTemplate = await getHtmlTemplate("RegistrationConfirmation.html");

  // Populate the template with the name variable
  const html = htmlTemplate.replace("{{name}}", newUser.name);

  // Send the email
  const info = await transport.sendMail({
    to: newUser.email,
    from: FROM,
    subject: "Thank you for registering with the Portal",
    html: html,
  });

  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`� Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}

export async function sendAccessGrantedEmail(to: string): Promise<void> {
  // Get the absolute path to the HTML template file
  const htmlTemplate = await getHtmlTemplate("AccessGranted.html");

  // Define the loginURL
  const loginURL = process.env.FRONTEND_URL + "/login";

  const search = "{{loginURL}}";
  const replacer = new RegExp(search, "g");

  // Populate the template with the name variable
  const html = htmlTemplate.replace(replacer, loginURL);

  // Send the email
  const info = await transport.sendMail({
    to,
    from: FROM,
    subject: "Welcome to the Portal!",
    html: html,
  });

  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`� Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}

export async function sendAccountCreatedEmail(to: string): Promise<void> {
  // Get the absolute path to the HTML template file
  const htmlTemplate = await getHtmlTemplate("AccountCreated.html");

  // Define the loginURL
  const loginURL = process.env.FRONTEND_URL + "/login";

  const search = "{{loginURL}}";
  const replacer = new RegExp(search, "g");

  // Populate the template with the name variable
  let html = htmlTemplate.replace(replacer, loginURL);

  html = html.replace(new RegExp("{{ACCOUNT_EMAIL}}", "g"), to);

  // Send the email
  const info = await transport.sendMail({
    to,
    from: FROM,
    subject: "Welcome to the Portal!",
    html: html,
  });

  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`� Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}

export async function sendRequestProfileUpdateEmail(
  user: UserData,
  updatedUserData: UserData,
): Promise<void> {
  const info = await transport.sendMail({
    to: TO_ADMIN,
    from: FROM,
    subject: `User with email ${user.email} is requesting to update their profile`,
    html: makeANiceEmail(`Profile update requested!
    <h3>Current Profile</h3>
    <ul>
      <li>name: ${user.name}</li>
      <li>email: ${user.email}</li>
      <li>cpso: ${user.cpso}</li>
      <li>sites: ${user.sites?.join(", ")}</li>
    </ul>
    <hr/>
    <h3>Requested Update</h3>
    <ul>
      <li>name: ${updatedUserData.name}</li>
      <li>email: ${updatedUserData.email}</li>
      <li>cpso: ${updatedUserData.cpso}</li>
      <li>sites: ${updatedUserData.sites?.join(", ")}</li>
    </ul>
      `),
  });
  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`� Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}

export async function sendProfileUpdateNotification(
  status: string,
  to: string,
): Promise<void> {
  // Select the appropriate template path based on the status
  let templateFileName: string = "ProfileApproved.html";

  if (status === "DECLINED") {
    templateFileName = "ProfileDeclined.html";
  }

  // Get the absolute path to the HTML template file
  const htmlTemplate = await getHtmlTemplate(templateFileName);

  const info = await transport.sendMail({
    to: to,
    from: FROM,
    subject: `Profile update request is ${status}`,
    html: htmlTemplate,
  });
  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`� Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}
