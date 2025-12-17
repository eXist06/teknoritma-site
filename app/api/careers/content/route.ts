import { NextRequest, NextResponse } from "next/server";
import { CareersContent } from "@/lib/types/careers";
import { getCurrentUser } from "@/lib/utils/role-verification";
import { getCareersContent, updateCareersContent } from "@/lib/db/careers";

async function verifyIKOrAdminRole(request: NextRequest): Promise<{ authorized: boolean; error?: string }> {
  const { user, error } = await getCurrentUser(request);
  if (error || !user) {
    return { authorized: false, error: "Unauthorized" };
  }
  
  // Admin ve IK rolleri erişebilir
  if (user.role === "admin" || user.role === "ik") {
    return { authorized: true };
  }
  
  return { authorized: false, error: "Insufficient permissions. Requires admin or IK role." };
}

export async function GET() {
  try {
    const content = getCareersContent();
    return NextResponse.json(
      { content: content || {} },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authCheck = await verifyIKOrAdminRole(request);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: 401 });
    }
    
    const content: CareersContent = await request.json();
    updateCareersContent(content);
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
