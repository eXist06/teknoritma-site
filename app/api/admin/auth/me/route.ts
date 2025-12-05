import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/role-verification";

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentUser(request);
    
    if (result.error || !result.user) {
      return NextResponse.json(
        { error: result.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Don't send password hash
    const { passwordHash, ...userWithoutPassword } = result.user;
    
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


