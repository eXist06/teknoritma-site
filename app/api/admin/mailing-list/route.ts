import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";
import { MailingList } from "@/lib/types/mailing";

const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";
const MAILING_LIST_PATH = path.join(process.cwd(), "lib/data/mailing-list.json");

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
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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









