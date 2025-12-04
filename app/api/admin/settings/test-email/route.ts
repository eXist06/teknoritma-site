import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { sendEmail } from "@/lib/services/email";

const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";

async function verifyToken(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    console.log(`[EMAIL TEST] Starting test email to: ${email}`);
    console.log(`[EMAIL TEST] Timestamp: ${new Date().toISOString()}`);

    const result = await sendEmail({
      to: email,
      subject: "Test Email from Teknoritma Admin",
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from Teknoritma admin panel.</p>
        <p>If you received this email, your email settings are configured correctly.</p>
      `,
      text: "This is a test email from Teknoritma admin panel. If you received this email, your email settings are configured correctly.",
    });

    if (result.success) {
      const messageId = 'messageId' in result ? result.messageId : undefined;
      console.log(`[EMAIL TEST] ✅ SUCCESS - Email sent successfully to ${email}`);
      console.log(`[EMAIL TEST] Message ID: ${messageId || 'N/A'}`);
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        messageId: messageId,
        log: `Email sent successfully to ${email} at ${new Date().toISOString()}. Message ID: ${messageId || 'N/A'}`,
      });
    } else {
      const errorMessage = 'error' in result ? result.error : 'Unknown error';
      console.error(`[EMAIL TEST] ❌ FAILED - Error sending email to ${email}`);
      console.error(`[EMAIL TEST] Error details:`, errorMessage);
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          log: `Failed to send email to ${email} at ${new Date().toISOString()}. Error: ${errorMessage}`,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[EMAIL TEST] ❌ EXCEPTION - Unexpected error:", error);
    console.error("[EMAIL TEST] Error stack:", error?.stack);
    return NextResponse.json(
      { 
        error: "Internal server error",
        log: `Exception occurred at ${new Date().toISOString()}. Error: ${error?.message || String(error)}`,
      },
      { status: 500 }
    );
  }
}

