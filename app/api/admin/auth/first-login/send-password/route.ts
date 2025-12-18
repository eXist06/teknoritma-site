import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/services/email";
import bcrypt from "bcryptjs";
import { getAllAdminUsers, getSystemSettings, createFirstLoginPassword, deleteExpiredFirstLoginPasswords } from "@/lib/db/admin";

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

    const allUsers = getAllAdminUsers();

    // Check if users already exist
    if (allUsers.length > 0) {
      return NextResponse.json(
        { error: "Admin users already exist. Please use regular login." },
        { status: 403 }
      );
    }

    // Check if user already exists with this email
    const existingUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Clean up expired passwords
    deleteExpiredFirstLoginPasswords();

    // Generate random password
    const generatedPassword = generateRandomPassword();
    const passwordHash = await bcrypt.hash(generatedPassword, 10);

    // Store password temporarily
    createFirstLoginPassword(email, generatedPassword, passwordHash);

    // Send password via email
    const settings = getSystemSettings();
    const emailSettings = settings.email;
    const { SITE_URL } = await import("@/lib/config");
    
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
            <p>Şifreyi doğrulamak için: <a href="${SITE_URL}/admin/first-login">İlk Giriş Sayfası</a></p>
            <p>Teşekkürler,<br>Teknoritma</p>
          `,
          text: `Teknoritma Admin Panel - İlk Giriş Şifreniz\n\nMerhaba,\n\nTeknoritma Admin Panel'e ilk giriş için şifreniz oluşturuldu:\n\n${generatedPassword}\n\nGüvenlik Uyarısı: Bu şifreyi kimseyle paylaşmayın. Şifreyi doğruladıktan sonra yeni bir şifre belirlemeniz gerekecektir.\n\nŞifreyi doğrulamak için: ${SITE_URL}/admin/first-login\n\nTeşekkürler,\nTeknoritma`,
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
