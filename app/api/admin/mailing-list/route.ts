import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MailingList } from "@/lib/types/mailing";
import { verifyAdminRole } from "@/lib/utils/role-verification";

const MAILING_LIST_PATH = path.join(process.cwd(), "lib/data/mailing-list.json");

function readMailingList(): MailingList {
  try {
    const data = fs.readFileSync(MAILING_LIST_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { subscribers: [] };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Only admin can view mailing list
    const authCheck = await verifyAdminRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const mailingList = readMailingList();
    return NextResponse.json({ subscribers: mailingList.subscribers });
  } catch (error) {
    console.error("Error reading mailing list:", error);
    return NextResponse.json(
      { error: "Failed to read mailing list" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only admin can delete from mailing list
    const authCheck = await verifyAdminRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    const mailingList = readMailingList();
    mailingList.subscribers = mailingList.subscribers.filter(
      (s) => s.id !== id
    );

    fs.writeFileSync(
      MAILING_LIST_PATH,
      JSON.stringify(mailingList, null, 2),
      "utf8"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}









