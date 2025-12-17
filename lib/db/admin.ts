import { getDatabase } from "./schema";
import { AdminUser, UserRole } from "@/lib/types/admin";
import Database from "better-sqlite3";

export function getAllAdminUsers(): AdminUser[] {
  const db = getDatabase();
  try {
    const users = db.prepare("SELECT * FROM admin_users ORDER BY created_at DESC").all() as any[];
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      passwordHash: u.password_hash,
      email: u.email,
      role: u.role as UserRole,
      isFirstLogin: u.is_first_login === 1,
      createdAt: u.created_at,
      updatedAt: u.updated_at,
    }));
  } finally {
    db.close();
  }
}

export function getAdminUserById(id: string): AdminUser | null {
  const db = getDatabase();
  try {
    const user = db.prepare("SELECT * FROM admin_users WHERE id = ?").get(id) as any;
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      passwordHash: user.password_hash,
      email: user.email,
      role: user.role as UserRole,
      isFirstLogin: user.is_first_login === 1,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  } finally {
    db.close();
  }
}

export function getAdminUserByEmail(email: string): AdminUser | null {
  const db = getDatabase();
  try {
    const user = db.prepare("SELECT * FROM admin_users WHERE email = ?").get(email.toLowerCase()) as any;
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      passwordHash: user.password_hash,
      email: user.email,
      role: user.role as UserRole,
      isFirstLogin: user.is_first_login === 1,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  } finally {
    db.close();
  }
}

export function getAdminUserByUsername(username: string): AdminUser | null {
  const db = getDatabase();
  try {
    const user = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username) as any;
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      passwordHash: user.password_hash,
      email: user.email,
      role: user.role as UserRole,
      isFirstLogin: user.is_first_login === 1,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  } finally {
    db.close();
  }
}

export function createAdminUser(user: Omit<AdminUser, "id" | "createdAt" | "updatedAt"> & { id?: string }): AdminUser {
  const db = getDatabase();
  try {
    const id = user.id || Date.now().toString();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO admin_users (id, username, password_hash, email, role, is_first_login, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      user.username,
      user.passwordHash,
      user.email.toLowerCase(),
      user.role,
      user.isFirstLogin ? 1 : 0,
      now,
      now
    );
    
    return {
      id,
      username: user.username,
      passwordHash: user.passwordHash,
      email: user.email.toLowerCase(),
      role: user.role,
      isFirstLogin: user.isFirstLogin,
      createdAt: now,
      updatedAt: now,
    };
  } finally {
    db.close();
  }
}

export function updateAdminUser(id: string, updates: Partial<Omit<AdminUser, "id" | "createdAt" | "updatedAt">>): AdminUser {
  const db = getDatabase();
  try {
    const existing = getAdminUserById(id);
    if (!existing) {
      throw new Error("User not found");
    }
    
    const updatedAt = new Date().toISOString();
    const updatesToApply: any = {};
    
    if (updates.username !== undefined) updatesToApply.username = updates.username;
    if (updates.email !== undefined) updatesToApply.email = updates.email.toLowerCase();
    if (updates.role !== undefined) updatesToApply.role = updates.role;
    if (updates.passwordHash !== undefined) updatesToApply.password_hash = updates.passwordHash;
    if (updates.isFirstLogin !== undefined) updatesToApply.is_first_login = updates.isFirstLogin ? 1 : 0;
    
    const setClause = Object.keys(updatesToApply)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updatesToApply), updatedAt, id];
    
    db.prepare(`UPDATE admin_users SET ${setClause}, updated_at = ? WHERE id = ?`).run(...values);
    
    return getAdminUserById(id)!;
  } finally {
    db.close();
  }
}

export function deleteAdminUser(id: string): boolean {
  const db = getDatabase();
  try {
    const result = db.prepare("DELETE FROM admin_users WHERE id = ?").run(id);
    return result.changes > 0;
  } finally {
    db.close();
  }
}

export function getSystemSettings(): { email: any; siteName: string; siteUrl: string } {
  const db = getDatabase();
  try {
    const emailRow = db.prepare("SELECT value FROM system_settings WHERE key = ?").get("email") as { value: string } | undefined;
    const siteRow = db.prepare("SELECT value FROM system_settings WHERE key = ?").get("site") as { value: string } | undefined;
    
    const email = emailRow ? JSON.parse(emailRow.value) : {};
    const site = siteRow ? JSON.parse(siteRow.value) : { siteName: "", siteUrl: "" };
    
    return {
      email,
      siteName: site.siteName || "",
      siteUrl: site.siteUrl || "",
    };
  } finally {
    db.close();
  }
}

export function updateSystemSettings(settings: { email?: any; siteName?: string; siteUrl?: string }): void {
  const db = getDatabase();
  try {
    const now = new Date().toISOString();
    
    if (settings.email !== undefined) {
      db.prepare(`
        INSERT OR REPLACE INTO system_settings (key, value, updated_at)
        VALUES ('email', ?, ?)
      `).run(JSON.stringify(settings.email), now);
    }
    
    if (settings.siteName !== undefined || settings.siteUrl !== undefined) {
      const currentSite = db.prepare("SELECT value FROM system_settings WHERE key = ?").get("site") as { value: string } | undefined;
      const siteData = currentSite ? JSON.parse(currentSite.value) : {};
      
      const updatedSite = {
        siteName: settings.siteName !== undefined ? settings.siteName : siteData.siteName || "",
        siteUrl: settings.siteUrl !== undefined ? settings.siteUrl : siteData.siteUrl || "",
      };
      
      db.prepare(`
        INSERT OR REPLACE INTO system_settings (key, value, updated_at)
        VALUES ('site', ?, ?)
      `).run(JSON.stringify(updatedSite), now);
    }
  } finally {
    db.close();
  }
}

export interface FirstLoginPassword {
  id: string;
  email: string;
  password: string;
  passwordHash: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

export function createFirstLoginPassword(email: string, password: string, passwordHash: string): FirstLoginPassword {
  const db = getDatabase();
  try {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    
    // Remove old passwords for this email
    db.prepare("DELETE FROM first_login_passwords WHERE email = ? AND expires_at < ?").run(email.toLowerCase(), new Date().toISOString());
    
    db.prepare(`
      INSERT INTO first_login_passwords (id, email, password, password_hash, created_at, expires_at, used)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, email.toLowerCase(), password, passwordHash, createdAt, expiresAt, 0);
    
    return {
      id,
      email: email.toLowerCase(),
      password,
      passwordHash,
      createdAt,
      expiresAt,
      used: false,
    };
  } finally {
    db.close();
  }
}

export function getFirstLoginPasswordByEmail(email: string): FirstLoginPassword | null {
  const db = getDatabase();
  try {
    const password = db.prepare(`
      SELECT * FROM first_login_passwords 
      WHERE email = ? AND used = 0 AND expires_at > ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(email.toLowerCase(), new Date().toISOString()) as any;
    
    if (!password) return null;
    
    return {
      id: password.id,
      email: password.email,
      password: password.password,
      passwordHash: password.password_hash,
      createdAt: password.created_at,
      expiresAt: password.expires_at,
      used: password.used === 1,
    };
  } finally {
    db.close();
  }
}

export function markFirstLoginPasswordAsUsed(id: string): void {
  const db = getDatabase();
  try {
    db.prepare("UPDATE first_login_passwords SET used = 1 WHERE id = ?").run(id);
  } finally {
    db.close();
  }
}

export function deleteExpiredFirstLoginPasswords(): number {
  const db = getDatabase();
  try {
    const now = new Date().toISOString();
    const result = db.prepare("DELETE FROM first_login_passwords WHERE expires_at < ? OR used = 1").run(now);
    return result.changes;
  } finally {
    db.close();
  }
}

