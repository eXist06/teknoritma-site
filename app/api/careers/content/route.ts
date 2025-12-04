import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CareersContent } from "@/lib/types/careers";

const dataFilePath = path.join(process.cwd(), "lib/data/careers-data.json");

function readData() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    return { jobs: [], content: {} };
  }
}

function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json({ content: data.content || {} });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const content: CareersContent = await request.json();
    
    const data = readData();
    data.content = content;
    writeData(data);
    
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}


