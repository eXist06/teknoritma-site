import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { EmailSettings, EmailProvider } from "@/lib/types/admin";

const SETTINGS_PATH = path.join(process.cwd(), "lib/data/admin-data.json");

function getEmailSettings(): EmailSettings | null {
  try {
    const data = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
    return data.settings?.email || null;
  } catch {
    return null;
  }
}

async function sendViaSMTP(
  settings: EmailSettings,
  to: string,
  subject: string,
  html?: string,
  text?: string
) {
  try {
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpSecure || settings.smtpPort === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword,
      },
    });

    const info = await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`[SMTP] ✅ Email sent successfully to ${to}, messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[SMTP] ❌ Failed to send email to ${to}:`, error);
    return { 
      success: false, 
      error: error?.message || String(error),
    };
  }
}

async function sendViaMailjet(
  settings: EmailSettings,
  to: string,
  subject: string,
  html?: string,
  text?: string
) {
  // Dynamic import for Mailjet
  const MailjetModule = await import("node-mailjet");
  const Mailjet = MailjetModule.default || MailjetModule;
  const mailjet = Mailjet.apiConnect(
    settings.mailjetApiKey || settings.apiKey,
    settings.mailjetApiSecret || settings.apiSecret
  );

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: settings.fromEmail,
          Name: settings.fromName,
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  });

  const result: any = await request;
  return {
    success: true,
    messageId: result.body?.Messages?.[0]?.To?.[0]?.MessageID || 'N/A',
  };
}

async function sendViaSendGrid(
  settings: EmailSettings,
  to: string,
  subject: string,
  html?: string,
  text?: string
) {
  // Dynamic import for SendGrid
  const sgMailModule = await import("@sendgrid/mail");
  const sgMail = sgMailModule.default || sgMailModule;
  sgMail.setApiKey(settings.sendgridApiKey || settings.apiKey);

  const msg: any = {
    to,
    from: {
      email: settings.fromEmail,
      name: settings.fromName,
    },
    subject,
    ...(text && { text }),
    ...(html && { html }),
  };

  const result = await sgMail.send(msg);
  return { success: true, messageId: result[0]?.headers?.["x-message-id"] };
}

async function sendViaSES(
  settings: EmailSettings,
  to: string,
  subject: string,
  html?: string,
  text?: string
) {
  const AWS = await import("aws-sdk");
  const ses = new AWS.SES({
    region: settings.sesRegion || "us-east-1",
    accessKeyId: settings.sesAccessKeyId || settings.apiKey,
    secretAccessKey: settings.sesSecretAccessKey || settings.apiSecret,
  });

  const params: AWS.SES.SendEmailRequest = {
    Source: `"${settings.fromName}" <${settings.fromEmail}>`,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        ...(html && { Html: { Data: html, Charset: "UTF-8" } }),
        ...(text && { Text: { Data: text, Charset: "UTF-8" } }),
      },
    },
  };

  const result = await ses.sendEmail(params).promise();
  return { success: true, messageId: result.MessageId };
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  const settings = getEmailSettings();

  console.log(`[EMAIL SERVICE] Attempting to send email to: ${to}`);
  console.log(`[EMAIL SERVICE] Subject: ${subject}`);
  console.log(`[EMAIL SERVICE] Provider: ${settings?.provider || 'N/A'}`);

  if (!settings || !settings.enabled) {
    console.warn("[EMAIL SERVICE] ⚠️ Email service is not configured or disabled");
    return { success: false, error: "Email service is not configured or disabled" };
  }

  // Validate required fields based on provider
  if (!settings.fromEmail || !settings.fromName) {
    console.error("[EMAIL SERVICE] ❌ From email and name are required");
    return {
      success: false,
      error: "From email and name are required",
    };
  }

  try {
    console.log(`[EMAIL SERVICE] Using provider: ${settings.provider}`);
    switch (settings.provider) {
      case "mailjet":
        if (!settings.mailjetApiKey && !settings.apiKey) {
          console.error("[EMAIL SERVICE] ❌ Mailjet API key is required");
          return {
            success: false,
            error: "Mailjet API key is required",
          };
        }
        if (!settings.mailjetApiSecret && !settings.apiSecret) {
          console.error("[EMAIL SERVICE] ❌ Mailjet API secret is required");
          return {
            success: false,
            error: "Mailjet API secret is required",
          };
        }
        console.log("[EMAIL SERVICE] Sending via Mailjet...");
        const mailjetResult = await sendViaMailjet(settings, to, subject, html, text);
        console.log(`[EMAIL SERVICE] Mailjet result:`, mailjetResult);
        return mailjetResult;

      case "sendgrid":
        if (!settings.sendgridApiKey && !settings.apiKey) {
          console.error("[EMAIL SERVICE] ❌ SendGrid API key is required");
          return {
            success: false,
            error: "SendGrid API key is required",
          };
        }
        console.log("[EMAIL SERVICE] Sending via SendGrid...");
        const sendgridResult = await sendViaSendGrid(settings, to, subject, html, text);
        console.log(`[EMAIL SERVICE] SendGrid result:`, sendgridResult);
        return sendgridResult;

      case "ses":
        if (
          (!settings.sesAccessKeyId && !settings.apiKey) ||
          (!settings.sesSecretAccessKey && !settings.apiSecret)
        ) {
          console.error("[EMAIL SERVICE] ❌ AWS SES credentials are required");
          return {
            success: false,
            error: "AWS SES credentials are required",
          };
        }
        console.log("[EMAIL SERVICE] Sending via AWS SES...");
        const sesResult = await sendViaSES(settings, to, subject, html, text);
        console.log(`[EMAIL SERVICE] SES result:`, sesResult);
        return sesResult;

      case "smtp":
      default:
        if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
          console.error("[EMAIL SERVICE] ❌ SMTP settings are incomplete");
          return {
            success: false,
            error: "SMTP settings are incomplete",
          };
        }
        console.log("[EMAIL SERVICE] Sending via SMTP...");
        try {
          const smtpResult = await sendViaSMTP(settings, to, subject, html, text);
          console.log(`[EMAIL SERVICE] SMTP result:`, smtpResult);
          return smtpResult;
        } catch (smtpError: any) {
          console.error("[EMAIL SERVICE] ❌ SMTP send error:", smtpError);
          return {
            success: false,
            error: smtpError?.message || String(smtpError),
          };
        }
    }
  } catch (error: any) {
    console.error("[EMAIL SERVICE] ❌ EXCEPTION - Email send error:", error);
    console.error("[EMAIL SERVICE] Error message:", error?.message);
    console.error("[EMAIL SERVICE] Error stack:", error?.stack);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: email,
    subject: "Password Reset Request - Teknoritma",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    text: `Password Reset Request\n\nClick this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
  });
}

