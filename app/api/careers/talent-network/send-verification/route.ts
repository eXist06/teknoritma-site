import { NextRequest, NextResponse } from "next/server";
import { sendVerificationCode } from "@/lib/services/email-verification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await sendVerificationCode(email, "careers");

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Verification code sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send verification code" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Send verification code error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}








