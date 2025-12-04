export type UserRole = "admin" | "ik" | "knowledge-base" | "sarus-hub";

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  role: UserRole;
  isFirstLogin: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EmailProvider = "smtp" | "mailjet" | "sendgrid" | "ses";

export interface EmailSettings {
  provider: EmailProvider;
  enabled: boolean;
  // SMTP Settings
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean; // SSL/TLS
  // API Settings (Mailjet, SendGrid, SES)
  apiKey: string;
  apiSecret: string;
  // Common Settings
  fromEmail: string;
  fromName: string;
  // Provider-specific settings
  mailjetApiKey?: string;
  mailjetApiSecret?: string;
  sendgridApiKey?: string;
  sesRegion?: string;
  sesAccessKeyId?: string;
  sesSecretAccessKey?: string;
}

export interface SystemSettings {
  email: EmailSettings;
  siteName: string;
  siteUrl: string;
}

