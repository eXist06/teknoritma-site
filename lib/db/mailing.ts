import { getDatabase } from "./schema";
import { MailingSubscriber } from "@/lib/types/mailing";
import Database from "better-sqlite3";

export function getAllMailingSubscribers(): MailingSubscriber[] {
  const db = getDatabase();
  try {
    const subscribers = db.prepare("SELECT * FROM mailing_subscribers ORDER BY subscribed_at DESC").all() as any[];
    return subscribers.map((s) => ({
      id: s.id,
      email: s.email,
      name: s.name || undefined,
      organization: s.organization || undefined,
      subscribedAt: s.subscribed_at,
      source: s.source as any,
      category: JSON.parse(s.category) as any,
      tags: JSON.parse(s.tags || "[]"),
      active: s.active === 1,
    }));
  } finally {
    db.close();
  }
}

export function getMailingSubscriberByEmail(email: string): MailingSubscriber | null {
  const db = getDatabase();
  try {
    const sub = db.prepare("SELECT * FROM mailing_subscribers WHERE email = ?").get(email.toLowerCase()) as any;
    if (!sub) return null;
    return {
      id: sub.id,
      email: sub.email,
      name: sub.name || undefined,
      organization: sub.organization || undefined,
      subscribedAt: sub.subscribed_at,
      source: sub.source as any,
      category: JSON.parse(sub.category) as any,
      tags: JSON.parse(sub.tags || "[]"),
      active: sub.active === 1,
    };
  } finally {
    db.close();
  }
}

export function getMailingSubscribersByCategory(category: string | string[]): MailingSubscriber[] {
  const db = getDatabase();
  try {
    const allSubscribers = getAllMailingSubscribers();
    const categories = Array.isArray(category) ? category : [category];
    
    return allSubscribers.filter((sub) => {
      const subCategories = Array.isArray(sub.category) ? sub.category : [sub.category];
      return subCategories.some((cat) => categories.includes(cat)) && sub.active;
    });
  } finally {
    db.close();
  }
}

export function createMailingSubscriber(subscriber: Omit<MailingSubscriber, "id" | "subscribedAt"> & { id?: string; subscribedAt?: string }): MailingSubscriber {
  const db = getDatabase();
  try {
    const id = subscriber.id || Date.now().toString();
    const subscribedAt = subscriber.subscribedAt || new Date().toISOString();
    
    const category = Array.isArray(subscriber.category) 
      ? JSON.stringify(subscriber.category) 
      : subscriber.category;
    
    db.prepare(`
      INSERT OR REPLACE INTO mailing_subscribers
      (id, email, name, organization, subscribed_at, source, category, tags, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      subscriber.email.toLowerCase(),
      subscriber.name || null,
      subscriber.organization || null,
      subscribedAt,
      subscriber.source,
      category,
      JSON.stringify(subscriber.tags || []),
      subscriber.active ? 1 : 0,
      subscribedAt,
      subscribedAt
    );
    
    return {
      id,
      email: subscriber.email.toLowerCase(),
      name: subscriber.name,
      organization: subscriber.organization,
      subscribedAt,
      source: subscriber.source,
      category: subscriber.category,
      tags: subscriber.tags || [],
      active: subscriber.active,
    };
  } finally {
    db.close();
  }
}

export function updateMailingSubscriber(id: string, updates: Partial<Omit<MailingSubscriber, "id" | "subscribedAt">>): MailingSubscriber {
  const db = getDatabase();
  try {
    const existing = db.prepare("SELECT * FROM mailing_subscribers WHERE id = ?").get(id) as any;
    if (!existing) {
      throw new Error("Subscriber not found");
    }
    
    const updatedAt = new Date().toISOString();
    const updatesToApply: any = {};
    
    if (updates.email !== undefined) updatesToApply.email = updates.email.toLowerCase();
    if (updates.name !== undefined) updatesToApply.name = updates.name || null;
    if (updates.organization !== undefined) updatesToApply.organization = updates.organization || null;
    if (updates.source !== undefined) updatesToApply.source = updates.source;
    if (updates.category !== undefined) {
      updatesToApply.category = Array.isArray(updates.category) 
        ? JSON.stringify(updates.category) 
        : updates.category;
    }
    if (updates.tags !== undefined) updatesToApply.tags = JSON.stringify(updates.tags || []);
    if (updates.active !== undefined) updatesToApply.active = updates.active ? 1 : 0;
    
    const setClause = Object.keys(updatesToApply)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updatesToApply), updatedAt, id];
    
    db.prepare(`UPDATE mailing_subscribers SET ${setClause}, updated_at = ? WHERE id = ?`).run(...values);
    
    const updated = db.prepare("SELECT * FROM mailing_subscribers WHERE id = ?").get(id) as any;
    return {
      id: updated.id,
      email: updated.email,
      name: updated.name || undefined,
      organization: updated.organization || undefined,
      subscribedAt: updated.subscribed_at,
      source: updated.source as any,
      category: JSON.parse(updated.category) as any,
      tags: JSON.parse(updated.tags || "[]"),
      active: updated.active === 1,
    };
  } finally {
    db.close();
  }
}

export function deleteMailingSubscriber(id: string): boolean {
  const db = getDatabase();
  try {
    const result = db.prepare("DELETE FROM mailing_subscribers WHERE id = ?").run(id);
    return result.changes > 0;
  } finally {
    db.close();
  }
}

