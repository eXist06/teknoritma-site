import { getDatabase } from "./schema";
import { JobPosting, CareersContent } from "@/lib/types/careers";
import Database from "better-sqlite3";

// ============ JOBS ============

export function getAllCareersJobs(activeOnly: boolean = false): JobPosting[] {
  const db = getDatabase();
  try {
    let query = "SELECT * FROM careers_jobs";
    if (activeOnly) {
      query += " WHERE is_active = 1";
    }
    query += " ORDER BY created_at DESC";
    
    const jobs = db.prepare(query).all() as any[];
    return jobs.map((j) => ({
      id: j.id,
      title: j.title,
      titleEn: j.title_en,
      department: j.department,
      departmentEn: j.department_en,
      location: j.location,
      locationEn: j.location_en,
      type: j.type as any,
      typeEn: j.type_en as any,
      remote: j.remote as any,
      remoteEn: j.remote_en as any,
      description: j.description,
      descriptionEn: j.description_en,
      requirements: JSON.parse(j.requirements || "[]"),
      requirementsEn: JSON.parse(j.requirements_en || "[]"),
      benefits: JSON.parse(j.benefits || "[]"),
      benefitsEn: JSON.parse(j.benefits_en || "[]"),
      isActive: j.is_active === 1,
      createdAt: j.created_at,
      updatedAt: j.updated_at,
    }));
  } finally {
    db.close();
  }
}

export function getCareersJobById(id: string): JobPosting | null {
  const db = getDatabase();
  try {
    const job = db.prepare("SELECT * FROM careers_jobs WHERE id = ?").get(id) as any;
    if (!job) return null;
    return {
      id: job.id,
      title: job.title,
      titleEn: job.title_en,
      department: job.department,
      departmentEn: job.department_en,
      location: job.location,
      locationEn: job.location_en,
      type: job.type as any,
      typeEn: job.type_en as any,
      remote: job.remote as any,
      remoteEn: job.remote_en as any,
      description: job.description,
      descriptionEn: job.description_en,
      requirements: JSON.parse(job.requirements || "[]"),
      requirementsEn: JSON.parse(job.requirements_en || "[]"),
      benefits: JSON.parse(job.benefits || "[]"),
      benefitsEn: JSON.parse(job.benefits_en || "[]"),
      isActive: job.is_active === 1,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
    };
  } finally {
    db.close();
  }
}

export function createCareersJob(job: Omit<JobPosting, "id" | "createdAt" | "updatedAt"> & { id?: string }): JobPosting {
  const db = getDatabase();
  try {
    const id = job.id || `job-${Date.now()}`;
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO careers_jobs
      (id, title, title_en, department, department_en, location, location_en, type, type_en, remote, remote_en, description, description_en, requirements, requirements_en, benefits, benefits_en, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      job.title,
      job.titleEn,
      job.department,
      job.departmentEn,
      job.location,
      job.locationEn,
      job.type,
      job.typeEn,
      job.remote,
      job.remoteEn,
      job.description,
      job.descriptionEn,
      JSON.stringify(job.requirements || []),
      JSON.stringify(job.requirementsEn || []),
      JSON.stringify(job.benefits || []),
      JSON.stringify(job.benefitsEn || []),
      job.isActive ? 1 : 0,
      now,
      now
    );
    
    return getCareersJobById(id)!;
  } finally {
    db.close();
  }
}

export function updateCareersJob(id: string, updates: Partial<Omit<JobPosting, "id" | "createdAt" | "updatedAt">>): JobPosting {
  const db = getDatabase();
  try {
    const existing = getCareersJobById(id);
    if (!existing) {
      throw new Error("Job not found");
    }
    
    const updatedAt = new Date().toISOString();
    const updatesToApply: any = {};
    
    if (updates.title !== undefined) updatesToApply.title = updates.title;
    if (updates.titleEn !== undefined) updatesToApply.title_en = updates.titleEn;
    if (updates.department !== undefined) updatesToApply.department = updates.department;
    if (updates.departmentEn !== undefined) updatesToApply.department_en = updates.departmentEn;
    if (updates.location !== undefined) updatesToApply.location = updates.location;
    if (updates.locationEn !== undefined) updatesToApply.location_en = updates.locationEn;
    if (updates.type !== undefined) updatesToApply.type = updates.type;
    if (updates.typeEn !== undefined) updatesToApply.type_en = updates.typeEn;
    if (updates.remote !== undefined) updatesToApply.remote = updates.remote;
    if (updates.remoteEn !== undefined) updatesToApply.remote_en = updates.remoteEn;
    if (updates.description !== undefined) updatesToApply.description = updates.description;
    if (updates.descriptionEn !== undefined) updatesToApply.description_en = updates.descriptionEn;
    if (updates.requirements !== undefined) updatesToApply.requirements = JSON.stringify(updates.requirements);
    if (updates.requirementsEn !== undefined) updatesToApply.requirements_en = JSON.stringify(updates.requirementsEn);
    if (updates.benefits !== undefined) updatesToApply.benefits = JSON.stringify(updates.benefits);
    if (updates.benefitsEn !== undefined) updatesToApply.benefits_en = JSON.stringify(updates.benefitsEn);
    if (updates.isActive !== undefined) updatesToApply.is_active = updates.isActive ? 1 : 0;
    
    const setClause = Object.keys(updatesToApply)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updatesToApply), updatedAt, id];
    
    db.prepare(`UPDATE careers_jobs SET ${setClause}, updated_at = ? WHERE id = ?`).run(...values);
    
    return getCareersJobById(id)!;
  } finally {
    db.close();
  }
}

export function deleteCareersJob(id: string): boolean {
  const db = getDatabase();
  try {
    const result = db.prepare("DELETE FROM careers_jobs WHERE id = ?").run(id);
    return result.changes > 0;
  } finally {
    db.close();
  }
}

// ============ CONTENT ============

export function getCareersContent(): CareersContent | null {
  const db = getDatabase();
  try {
    const row = db.prepare("SELECT content FROM careers_content WHERE section = ?").get("all") as { content: string } | undefined;
    if (!row) return null;
    return JSON.parse(row.content);
  } finally {
    db.close();
  }
}

export function updateCareersContent(content: CareersContent): void {
  const db = getDatabase();
  try {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT OR REPLACE INTO careers_content (section, content, updated_at)
      VALUES ('all', ?, ?)
    `).run(JSON.stringify(content), now);
  } finally {
    db.close();
  }
}

// ============ TALENT NETWORK ============

export interface TalentNetworkEntry {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  jobCategory?: string;
  city?: string;
  remoteWorkplace?: string;
  cvFileName?: string;
  createdAt: string;
}

export function getAllTalentNetworkEntries(): TalentNetworkEntry[] {
  const db = getDatabase();
  try {
    const entries = db.prepare("SELECT * FROM talent_network ORDER BY created_at DESC").all() as any[];
    return entries.map((e) => ({
      id: e.id,
      firstName: e.first_name || undefined,
      lastName: e.last_name || undefined,
      email: e.email,
      phone: e.phone || undefined,
      jobCategory: e.job_category || undefined,
      city: e.city || undefined,
      remoteWorkplace: e.remote_workplace || undefined,
      cvFileName: e.cv_file_name || undefined,
      createdAt: e.created_at,
    }));
  } finally {
    db.close();
  }
}

export function getTalentNetworkEntryById(id: string): TalentNetworkEntry | null {
  const db = getDatabase();
  try {
    const entry = db.prepare("SELECT * FROM talent_network WHERE id = ?").get(id) as any;
    if (!entry) return null;
    return {
      id: entry.id,
      firstName: entry.first_name || undefined,
      lastName: entry.last_name || undefined,
      email: entry.email,
      phone: entry.phone || undefined,
      jobCategory: entry.job_category || undefined,
      city: entry.city || undefined,
      remoteWorkplace: entry.remote_workplace || undefined,
      cvFileName: entry.cv_file_name || undefined,
      createdAt: entry.created_at,
    };
  } finally {
    db.close();
  }
}

export function createTalentNetworkEntry(entry: Omit<TalentNetworkEntry, "id" | "createdAt"> & { id?: string }): TalentNetworkEntry {
  const db = getDatabase();
  try {
    const id = entry.id || Date.now().toString();
    const createdAt = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO talent_network
      (id, first_name, last_name, email, phone, job_category, city, remote_workplace, cv_file_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      entry.firstName || null,
      entry.lastName || null,
      entry.email,
      entry.phone || null,
      entry.jobCategory || null,
      entry.city || null,
      entry.remoteWorkplace || null,
      entry.cvFileName || null,
      createdAt
    );
    
    return getTalentNetworkEntryById(id)!;
  } finally {
    db.close();
  }
}

export function deleteTalentNetworkEntry(id: string): boolean {
  const db = getDatabase();
  try {
    const result = db.prepare("DELETE FROM talent_network WHERE id = ?").run(id);
    return result.changes > 0;
  } finally {
    db.close();
  }
}





