export interface EmailQueueItem {
  id: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromEmail?: string;
  fromName?: string;
  // Sender information (who submitted the form)
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  messageContent?: string;
  createdAt: string;
  lastAttemptAt?: string;
  attempts: number;
  maxAttempts: number;
  status: "pending" | "failed" | "sent";
  error?: string;
  nextRetryAt?: string;
}

export interface EmailQueue {
  items: EmailQueueItem[];
}

export interface EmailVerification {
  id: string;
  email: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  verified: boolean;
  attempts: number;
}

export interface EmailVerifications {
  verifications: EmailVerification[];
}

