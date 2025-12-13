import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/lib/services/email";
import { AdminUser } from "@/lib/types/admin";
import bcrypt from "bcryptjs";

const ADMIN_DATA_PATH = path.join(process.cwd(), "lib/data/admin-data.json");
const FIRST_LOGIN_PASSWORDS_PATH = path.join(process.cwd(), "lib/data/first-login-passwords.json");

function readAdminData() {
  try {
    const data = fs.readFileSync(ADMIN_DATA_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { users: [], settings: {} };
  }
}

function writeAdminData(data: any) {
  fs.writeFileSync(ADMIN_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

function readFirstLoginPasswords() {
  try {
    const data = fs.readFileSync(FIRST_LOGIN_PASSWORDS_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { passwords: [] };
  }
}

function writeFirstLoginPasswords(data: any) {
  fs.writeFileSync(FIRST_LOGIN_PASSWORDS_PATH, JSON.stringify(data, null, 2), "utf8");
}

function generateRandomPassword(): string {
  const length = 16;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

function isValidTeknoritmaEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain === "teknoritma.com.tr";
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidTeknoritmaEmail(email)) {
      return NextResponse.json(
        { error: "Only teknoritma.com.tr email addresses are allowed" },
        { status: 403 }
      );
    }

    const data = readAdminData();

    // Check if users already exist
    if (data.users.length > 0) {
      return NextResponse.json(
        { error: "Admin users already exist. Please use regular login." },
        { status: 403 }
      );
    }

    // Check if user already exists with this email
    const existingUser = data.users.find((u: AdminUser) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate random password
    const generatedPassword = generateRandomPassword();
    const passwordHash = await bcrypt.hash(generatedPassword, 10);

    // Store password temporarily (will be verified later)
    const passwordsData = readFirstLoginPasswords();
    passwordsData.passwords = passwordsData.passwords.filter((p: any) => {
      // Remove passwords older than 1 hour
      return new Date(p.createdAt).getTime() > Date.now() - 60 * 60 * 1000;
    });

    passwordsData.passwords.push({
      email: email.toLowerCase(),
      password: generatedPassword,
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    writeFirstLoginPasswords(passwordsData);

    // Send password via email
    const emailSettings = data.settings?.email;
    if (emailSettings?.enabled) {
      try {
        const emailResult = await sendEmail({
          to: email,
          subject: "Teknoritma Admin Panel - İlk Giriş Şifreniz",
          html: `
            <h2>Teknoritma Admin Panel - İlk Giriş Şifreniz</h2>
            <p>Merhaba,</p>
            <p>Teknoritma Admin Panel'e ilk giriş için şifreniz oluşturuldu:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; font-family: monospace; font-size: 18px; text-align: center; letter-spacing: 2px;">
              <strong>${generatedPassword}</strong>
            </div>
            <p><strong>Güvenlik Uyarısı:</strong> Bu şifreyi kimseyle paylaşmayın. Şifreyi doğruladıktan sonra yeni bir şifre belirlemeniz gerekecektir.</p>
            <p>Şifreyi doğrulamak için: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://emr.cemorion.com'}/admin/first-login">İlk Giriş Sayfası</a></p>
            <p>Teşekkürler,<br>Teknoritma</p>
          `,
          text: `Teknoritma Admin Panel - İlk Giriş Şifreniz\n\nMerhaba,\n\nTeknoritma Admin Panel'e ilk giriş için şifreniz oluşturuldu:\n\n${generatedPassword}\n\nGüvenlik Uyarısı: Bu şifreyi kimseyle paylaşmayın. Şifreyi doğruladıktan sonra yeni bir şifre belirlemeniz gerekecektir.\n\nŞifreyi doğrulamak için: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://emr.cemorion.com'}/admin/first-login\n\nTeşekkürler,\nTeknoritma`,
        });

        if (!emailResult.success) {
          const errorMsg = 'error' in emailResult ? emailResult.error : 'Unknown error';
          console.error("[FIRST LOGIN] Failed to send password email:", errorMsg);
          return NextResponse.json(
            { error: "Failed to send password email. Please check email service configuration." },
            { status: 500 }
          );
        }
      } catch (emailError) {
        console.error("[FIRST LOGIN] Email sending error:", emailError);
        return NextResponse.json(
          { error: "Failed to send password email" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Email service is not configured. Please configure email settings first." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password sent to email",
    });
  } catch (error) {
    console.error("Send password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}









