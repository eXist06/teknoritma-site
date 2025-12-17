import { NextRequest, NextResponse } from "next/server";
import { JobPosting } from "@/lib/types/careers";
import { getCurrentUser } from "@/lib/utils/role-verification";
import {
  getAllCareersJobs,
  createCareersJob,
  updateCareersJob,
  deleteCareersJob,
} from "@/lib/db/careers";

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
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    
    const jobs = getAllCareersJobs(activeOnly);
    
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
    
    // Extract fields excluding id, createdAt, updatedAt (these are handled by createCareersJob)
    const { id, createdAt, updatedAt, ...jobData } = job;
    
    const newJob = createCareersJob({
      ...jobData,
      id: id || undefined,
    });
    
    return NextResponse.json({ job: newJob });
  } catch (error) {
    console.error("Error creating job:", error);
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
    
    if (!job.id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }
    
    const updatedJob = updateCareersJob(job.id, job);
    
    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
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
    
    const deleted = deleteCareersJob(id);
    if (!deleted) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
