import { NextRequest, NextResponse } from "next/server";
import { processQueue } from "@/lib/services/email-queue";

// This endpoint should be called daily by a cron job
// You can use services like Vercel Cron, GitHub Actions, or external cron services
export async function GET(request: NextRequest) {
  // Optional: Add authentication/authorization here
  // For example, check for a secret token in headers
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET || "change-this-secret";

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[CRON] Processing email queue...");
    const result = await processQueue();
    console.log(`[CRON] Queue processed: ${result.processed} items, ${result.succeeded} succeeded, ${result.failed} failed`);
    
    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Error processing email queue:", error);
    return NextResponse.json(
      { error: "Failed to process email queue" },
      { status: 500 }
    );
  }
}









