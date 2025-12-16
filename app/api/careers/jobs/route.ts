import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { JobPosting } from "@/lib/types/careers";
import { getCurrentUser } from "@/lib/utils/role-verification";

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

export async function GET(request: NextRequest) {
  try {
    const data = readData();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    
    let jobs = data.jobs || [];
    if (activeOnly) {
      jobs = jobs.filter((job: JobPosting) => job.isActive);
    }
    
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = await verifyIKOrAdminRole(request);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: 401 });
    }
    
    const job: JobPosting = await request.json();
    
    const data = readData();
    const newJob: JobPosting = {
      ...job,
      id: job.id || `job-${Date.now()}`,
      createdAt: job.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    data.jobs = data.jobs || [];
    data.jobs.push(newJob);
    writeData(data);
    
    return NextResponse.json({ job: newJob });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authCheck = await verifyIKOrAdminRole(request);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: 401 });
    }
    
    const job: JobPosting = await request.json();
    
    const data = readData();
    data.jobs = data.jobs || [];
    const index = data.jobs.findIndex((j: JobPosting) => j.id === job.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    
    data.jobs[index] = {
      ...job,
      updatedAt: new Date().toISOString(),
    };
    
    writeData(data);
    
    return NextResponse.json({ job: data.jobs[index] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authCheck = await verifyIKOrAdminRole(request);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }
    
    const data = readData();
    data.jobs = data.jobs || [];
    data.jobs = data.jobs.filter((j: JobPosting) => j.id !== id);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}










