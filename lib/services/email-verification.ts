import fs from "fs";
import path from "path";
import { EmailVerification, EmailVerifications } from "@/lib/types/email-queue";
import { sendEmail } from "./email";

const VERIFICATIONS_PATH = path.join(process.cwd(), "lib/data/email-verifications.json");

function readVerifications(): EmailVerifications {
  try {
    const data = fs.readFileSync(VERIFICATIONS_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { verifications: [] };
  }
}

function writeVerifications(data: EmailVerifications) {
  fs.writeFileSync(VERIFICATIONS_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationCode(
  email: string,
  formType: "demo" | "contact" | "careers" = "demo"
): Promise<{ success: boolean; error?: string }> {
  const verifications = readVerifications();
  
  // Remove expired verifications and old verifications without formType
  const now = new Date();
  verifications.verifications = verifications.verifications.filter(
    (v) => {
      // Remove expired or verified
      if (new Date(v.expiresAt) <= now || v.verified) {
        return false;
      }
      // Remove old verifications without formType (migration)
      if (!('formType' in v)) {
        return false;
      }
      return true;
    }
  );

  // Check if there's a recent verification for this form type (within last 2 minutes)
  const recentVerification = verifications.verifications.find(
    (v) => v.email.toLowerCase() === email.toLowerCase() && 
           v.formType === formType &&
           new Date(v.createdAt).getTime() > now.getTime() - 120000
  );

  if (recentVerification) {
    return {
      success: false,
      error: "Please wait before requesting a new code",
    };
  }

  const code = generateVerificationCode();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

  const verification: EmailVerification = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    code,
    formType,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    verified: false,
    attempts: 0,
  };

  verifications.verifications.push(verification);
  writeVerifications(verifications);

  // Form tipine göre mesaj içeriği
  const formMessages = {
    demo: {
      subject: "Demo Talebi Doğrulama Kodu - Teknoritma",
      html: `
        <h2>Doğrulama Kodu</h2>
        <p>Demo talebiniz için doğrulama kodunuz:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px; text-align: center; color: #007bff; font-family: monospace;">${code}</h1>
        <p>Bu kod 15 dakika geçerlidir.</p>
        <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
      `,
      text: `Doğrulama Kodunuz: ${code}\n\nBu kod 15 dakika geçerlidir.`,
    },
    contact: {
      subject: "İletişim Formu Doğrulama Kodu - Teknoritma",
      html: `
        <h2>Doğrulama Kodu</h2>
        <p>İletişim formu başvurunuz için doğrulama kodunuz:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px; text-align: center; color: #007bff; font-family: monospace;">${code}</h1>
        <p>Bu kod 15 dakika geçerlidir.</p>
        <p>Eğer bu başvuruyu siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
      `,
      text: `Doğrulama Kodunuz: ${code}\n\nBu kod 15 dakika geçerlidir.`,
    },
    careers: {
      subject: "Kariyer Başvurusu Doğrulama Kodu - Teknoritma",
      html: `
        <h2>Doğrulama Kodu</h2>
        <p>Kariyer başvurunuz için doğrulama kodunuz:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px; text-align: center; color: #007bff; font-family: monospace;">${code}</h1>
        <p>Bu kod 15 dakika geçerlidir.</p>
        <p>Eğer bu başvuruyu siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
      `,
      text: `Doğrulama Kodunuz: ${code}\n\nBu kod 15 dakika geçerlidir.`,
    },
  };

  const message = formMessages[formType];

  // Send verification code email
  console.log(`[VERIFICATION] Sending ${formType} verification code to ${email}`);
  const emailResult = await sendEmail({
    to: email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (!emailResult.success) {
    // Remove verification if email failed
    verifications.verifications = verifications.verifications.filter((v) => v.id !== verification.id);
    writeVerifications(verifications);
    const errorMsg = 'error' in emailResult ? emailResult.error : 'Unknown error';
    console.error(`[VERIFICATION] Failed to send ${formType} verification code to ${email}:`, errorMsg);
    return {
      success: false,
      error: errorMsg || "Failed to send verification code",
    };
  }

  console.log(`[VERIFICATION] Successfully sent ${formType} verification code to ${email}`);
  return { success: true };
}

export function verifyCode(
  email: string, 
  code: string, 
  formType: "demo" | "contact" | "careers" = "demo"
): { success: boolean; error?: string } {
  const verifications = readVerifications();
  const now = new Date();

  console.log(`[VERIFICATION] Verifying ${formType} code for ${email}`);

  const verification = verifications.verifications.find(
    (v) =>
      v.email.toLowerCase() === email.toLowerCase() &&
      ('formType' in v ? v.formType === formType : false) && // Check formType exists and matches
      !v.verified &&
      new Date(v.expiresAt) > now
  );

  if (!verification) {
    console.log(`[VERIFICATION] No valid ${formType} verification found for ${email}`);
    return {
      success: false,
      error: "Invalid or expired verification code",
    };
  }

  verification.attempts += 1;

  if (verification.attempts > 5) {
    verification.verified = false;
    writeVerifications(verifications);
    return {
      success: false,
      error: "Too many attempts. Please request a new code",
    };
  }

  if (verification.code !== code) {
    writeVerifications(verifications);
    return {
      success: false,
      error: "Invalid verification code",
    };
  }

  verification.verified = true;
  writeVerifications(verifications);

  return { success: true };
}

