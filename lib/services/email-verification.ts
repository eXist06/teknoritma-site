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

export async function sendVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
  const verifications = readVerifications();
  
  // Remove expired verifications
  const now = new Date();
  verifications.verifications = verifications.verifications.filter(
    (v) => new Date(v.expiresAt) > now && !v.verified
  );

  // Check if there's a recent verification (within last 2 minutes)
  const recentVerification = verifications.verifications.find(
    (v) => v.email.toLowerCase() === email.toLowerCase() && 
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
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    verified: false,
    attempts: 0,
  };

  verifications.verifications.push(verification);
  writeVerifications(verifications);

  // Send verification code email
  const emailResult = await sendEmail({
    to: email,
    subject: "Demo Talebi Doğrulama Kodu - Teknoritma",
    html: `
      <h2>Doğrulama Kodu</h2>
      <p>Demo talebiniz için doğrulama kodunuz:</p>
      <h1 style="font-size: 32px; letter-spacing: 8px; text-align: center; color: #007bff; font-family: monospace;">${code}</h1>
      <p>Bu kod 15 dakika geçerlidir.</p>
      <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
    `,
    text: `Doğrulama Kodunuz: ${code}\n\nBu kod 15 dakika geçerlidir.`,
  });

  if (!emailResult.success) {
    // Remove verification if email failed
    verifications.verifications = verifications.verifications.filter((v) => v.id !== verification.id);
    writeVerifications(verifications);
    const errorMsg = 'error' in emailResult ? emailResult.error : 'Unknown error';
    return {
      success: false,
      error: errorMsg || "Failed to send verification code",
    };
  }

  return { success: true };
}

export function verifyCode(email: string, code: string): { success: boolean; error?: string } {
  const verifications = readVerifications();
  const now = new Date();

  const verification = verifications.verifications.find(
    (v) =>
      v.email.toLowerCase() === email.toLowerCase() &&
      !v.verified &&
      new Date(v.expiresAt) > now
  );

  if (!verification) {
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

