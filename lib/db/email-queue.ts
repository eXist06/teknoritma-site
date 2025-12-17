import { getDatabase } from "./schema";
import { EmailQueueItem } from "@/lib/types/email-queue";
import Database from "better-sqlite3";

export function getAllEmailQueueItems(status?: "pending" | "failed" | "sent"): EmailQueueItem[] {
  const db = getDatabase();
  try {
    let query = "SELECT * FROM email_queue";
    const params: any[] = [];
    
    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    }
    
    query += " ORDER BY created_at DESC";
    
    const items = db.prepare(query).all(...params) as any[];
    return items.map((i) => ({
      id: i.id,
      to: i.to_email,
      subject: i.subject,
      html: i.html,
      text: i.text || undefined,
      fromEmail: i.from_email || undefined,
      fromName: i.from_name || undefined,
      senderName: i.sender_name || undefined,
      senderEmail: i.sender_email || undefined,
      senderPhone: i.sender_phone || undefined,
      messageContent: i.message_content || undefined,
      createdAt: i.created_at,
      lastAttemptAt: i.last_attempt_at || undefined,
      attempts: i.attempts,
      maxAttempts: i.max_attempts,
      status: i.status as any,
      error: i.error || undefined,
      nextRetryAt: i.next_retry_at || undefined,
    }));
  } finally {
    db.close();
  }
}

export function getEmailQueueItemById(id: string): EmailQueueItem | null {
  const db = getDatabase();
  try {
    const item = db.prepare("SELECT * FROM email_queue WHERE id = ?").get(id) as any;
    if (!item) return null;
    return {
      id: item.id,
      to: item.to_email,
      subject: item.subject,
      html: item.html,
      text: item.text || undefined,
      fromEmail: item.from_email || undefined,
      fromName: item.from_name || undefined,
      senderName: item.sender_name || undefined,
      senderEmail: item.sender_email || undefined,
      senderPhone: item.sender_phone || undefined,
      messageContent: item.message_content || undefined,
      createdAt: item.created_at,
      lastAttemptAt: item.last_attempt_at || undefined,
      attempts: item.attempts,
      maxAttempts: item.max_attempts,
      status: item.status as any,
      error: item.error || undefined,
      nextRetryAt: item.next_retry_at || undefined,
    };
  } finally {
    db.close();
  }
}

export function createEmailQueueItem(item: Omit<EmailQueueItem, "id" | "createdAt"> & { id?: string }): EmailQueueItem {
  const db = getDatabase();
  try {
    const id = item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO email_queue
      (id, to_email, subject, html, text, from_email, from_name, sender_name, sender_email, sender_phone, message_content, created_at, last_attempt_at, attempts, max_attempts, status, error, next_retry_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      item.to,
      item.subject,
      item.html,
      item.text || null,
      item.fromEmail || null,
      item.fromName || null,
      item.senderName || null,
      item.senderEmail || null,
      item.senderPhone || null,
      item.messageContent || null,
      createdAt,
      item.lastAttemptAt || null,
      item.attempts || 0,
      item.maxAttempts || 7,
      item.status || "pending",
      item.error || null,
      item.nextRetryAt || null
    );
    
    return getEmailQueueItemById(id)!;
  } finally {
    db.close();
  }
}

export function updateEmailQueueItem(id: string, updates: Partial<Omit<EmailQueueItem, "id" | "createdAt">>): EmailQueueItem {
  const db = getDatabase();
  try {
    const existing = getEmailQueueItemById(id);
    if (!existing) {
      throw new Error("Queue item not found");
    }
    
    const updatesToApply: any = {};
    
    if (updates.to !== undefined) updatesToApply.to_email = updates.to;
    if (updates.subject !== undefined) updatesToApply.subject = updates.subject;
    if (updates.html !== undefined) updatesToApply.html = updates.html;
    if (updates.text !== undefined) updatesToApply.text = updates.text || null;
    if (updates.fromEmail !== undefined) updatesToApply.from_email = updates.fromEmail || null;
    if (updates.fromName !== undefined) updatesToApply.from_name = updates.fromName || null;
    if (updates.senderName !== undefined) updatesToApply.sender_name = updates.senderName || null;
    if (updates.senderEmail !== undefined) updatesToApply.sender_email = updates.senderEmail || null;
    if (updates.senderPhone !== undefined) updatesToApply.sender_phone = updates.senderPhone || null;
    if (updates.messageContent !== undefined) updatesToApply.message_content = updates.messageContent || null;
    if (updates.lastAttemptAt !== undefined) updatesToApply.last_attempt_at = updates.lastAttemptAt || null;
    if (updates.attempts !== undefined) updatesToApply.attempts = updates.attempts;
    if (updates.maxAttempts !== undefined) updatesToApply.max_attempts = updates.maxAttempts;
    if (updates.status !== undefined) updatesToApply.status = updates.status;
    if (updates.error !== undefined) updatesToApply.error = updates.error || null;
    if (updates.nextRetryAt !== undefined) updatesToApply.next_retry_at = updates.nextRetryAt || null;
    
    const setClause = Object.keys(updatesToApply)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updatesToApply), id];
    
    db.prepare(`UPDATE email_queue SET ${setClause} WHERE id = ?`).run(...values);
    
    return getEmailQueueItemById(id)!;
  } finally {
    db.close();
  }
}

export function deleteEmailQueueItem(id: string): boolean {
  const db = getDatabase();
  try {
    const result = db.prepare("DELETE FROM email_queue WHERE id = ?").run(id);
    return result.changes > 0;
  } finally {
    db.close();
  }
}

export function getPendingEmailQueueItems(): EmailQueueItem[] {
  return getAllEmailQueueItems("pending");
}

export function getFailedEmailQueueItems(): EmailQueueItem[] {
  return getAllEmailQueueItems("failed");
}

