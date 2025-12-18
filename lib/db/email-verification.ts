import { getDatabase } from "./schema";
import { EmailVerification } from "@/lib/types/email-queue";
import Database from "better-sqlite3";

export function getAllEmailVerifications(formType?: "demo" | "contact" | "careers"): EmailVerification[] {
  const db = getDatabase();
  try {
    let query = "SELECT * FROM email_verifications";
    const params: any[] = [];
    
    if (formType) {
      query += " WHERE form_type = ?";
      params.push(formType);
    }
    
    query += " ORDER BY created_at DESC";
    
    const verifications = db.prepare(query).all(...params) as any[];
    return verifications.map((v) => ({
      id: v.id,
      email: v.email,
      code: v.code,
      formType: v.form_type as any,
      createdAt: v.created_at,
      expiresAt: v.expires_at,
      verified: v.verified === 1,
      attempts: v.attempts,
    }));
  } finally {
    db.close();
  }
}

export function getEmailVerificationByEmailAndFormType(
  email: string,
  formType: "demo" | "contact" | "careers"
): EmailVerification | null {
  const db = getDatabase();
  try {
    const verification = db.prepare(`
      SELECT * FROM email_verifications 
      WHERE email = ? AND form_type = ? AND verified = 0
      ORDER BY created_at DESC
      LIMIT 1
    `).get(email.toLowerCase(), formType) as any;
    
    if (!verification) return null;
    
    return {
      id: verification.id,
      email: verification.email,
      code: verification.code,
      formType: verification.form_type as any,
      createdAt: verification.created_at,
      expiresAt: verification.expires_at,
      verified: verification.verified === 1,
      attempts: verification.attempts,
    };
  } finally {
    db.close();
  }
}

export function createEmailVerification(verification: Omit<EmailVerification, "id"> & { id?: string }): EmailVerification {
  const db = getDatabase();
  try {
    const id = verification.id || Date.now().toString();
    
    db.prepare(`
      INSERT INTO email_verifications
      (id, email, code, form_type, created_at, expires_at, verified, attempts)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      verification.email.toLowerCase(),
      verification.code,
      verification.formType,
      verification.createdAt,
      verification.expiresAt,
      verification.verified ? 1 : 0,
      verification.attempts || 0
    );
    
    return {
      id,
      email: verification.email.toLowerCase(),
      code: verification.code,
      formType: verification.formType,
      createdAt: verification.createdAt,
      expiresAt: verification.expiresAt,
      verified: verification.verified,
      attempts: verification.attempts || 0,
    };
  } finally {
    db.close();
  }
}

export function updateEmailVerification(id: string, updates: Partial<Omit<EmailVerification, "id">>): EmailVerification {
  const db = getDatabase();
  try {
    const updatesToApply: any = {};
    
    if (updates.verified !== undefined) updatesToApply.verified = updates.verified ? 1 : 0;
    if (updates.attempts !== undefined) updatesToApply.attempts = updates.attempts;
    
    const setClause = Object.keys(updatesToApply)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updatesToApply), id];
    
    db.prepare(`UPDATE email_verifications SET ${setClause} WHERE id = ?`).run(...values);
    
    const updated = db.prepare("SELECT * FROM email_verifications WHERE id = ?").get(id) as any;
    return {
      id: updated.id,
      email: updated.email,
      code: updated.code,
      formType: updated.form_type as any,
      createdAt: updated.created_at,
      expiresAt: updated.expires_at,
      verified: updated.verified === 1,
      attempts: updated.attempts,
    };
  } finally {
    db.close();
  }
}

export function deleteEmailVerification(id: string): boolean {
  const db = getDatabase();
  try {
    const result = db.prepare("DELETE FROM email_verifications WHERE id = ?").run(id);
    return result.changes > 0;
  } finally {
    db.close();
  }
}

export function deleteExpiredEmailVerifications(): number {
  const db = getDatabase();
  try {
    const now = new Date().toISOString();
    const result = db.prepare("DELETE FROM email_verifications WHERE expires_at < ? OR verified = 1").run(now);
    return result.changes;
  } finally {
    db.close();
  }
}



