import { EmailQueueItem, EmailQueue } from "@/lib/types/email-queue";
import { sendEmail } from "./email";
import {
  createEmailQueueItem,
  updateEmailQueueItem,
  getPendingEmailQueueItems,
  getFailedEmailQueueItems,
  deleteEmailQueueItem,
  getAllEmailQueueItems,
} from "@/lib/db/email-queue";

export function addToQueue(
  to: string,
  subject: string,
  html: string,
  text?: string,
  fromEmail?: string,
  fromName?: string,
  senderName?: string,
  senderEmail?: string,
  senderPhone?: string,
  messageContent?: string
): string {
  const item = createEmailQueueItem({
    to,
    subject,
    html,
    text,
    fromEmail,
    fromName,
    senderName,
    senderEmail,
    senderPhone,
    messageContent,
    attempts: 0,
    maxAttempts: 7, // Try for 7 days
    status: "pending",
  });
  
  console.log(`[EMAIL QUEUE] Added email to queue: ${item.id} -> ${to}`);
  return item.id;
}

// Process a single queue item immediately
export async function processQueueItem(itemId: string): Promise<{ success: boolean; error?: string }> {
  const item = getAllEmailQueueItems().find((i) => i.id === itemId);
  
  if (!item) {
    return { success: false, error: "Queue item not found" };
  }

  if (item.status === "sent") {
    return { success: true };
  }

  try {
    console.log(`[EMAIL QUEUE] Processing item ${item.id} (attempt ${item.attempts + 1}/${item.maxAttempts})`);
    
    const result = await sendEmail({
      to: item.to,
      subject: item.subject,
      html: item.html,
      text: item.text,
    });

    const updates: Partial<EmailQueueItem> = {
      attempts: item.attempts + 1,
      lastAttemptAt: new Date().toISOString(),
    };

    if (result.success) {
      updates.status = "sent";
      console.log(`[EMAIL QUEUE] ✅ Successfully sent email ${item.id}`);
    } else {
      updates.status = "failed";
      updates.error = 'error' in result ? result.error : 'Unknown error';
      
      // Schedule next retry for tomorrow
      const nextRetry = new Date();
      nextRetry.setDate(nextRetry.getDate() + 1);
      updates.nextRetryAt = nextRetry.toISOString();
      
      const errorMsg = 'error' in result ? result.error : 'Unknown error';
      console.log(`[EMAIL QUEUE] ❌ Failed to send email ${item.id}: ${errorMsg}`);
    }

    updateEmailQueueItem(itemId, updates);

    const errorMsg = result.success ? undefined : ('error' in result ? result.error : 'Unknown error');
    return { success: result.success || false, error: errorMsg };
  } catch (error: any) {
    const updates: Partial<EmailQueueItem> = {
      attempts: item.attempts + 1,
      status: "failed",
      error: error?.message || String(error),
      lastAttemptAt: new Date().toISOString(),
    };
    
    const nextRetry = new Date();
    nextRetry.setDate(nextRetry.getDate() + 1);
    updates.nextRetryAt = nextRetry.toISOString();
    
    updateEmailQueueItem(itemId, updates);
    
    console.error(`[EMAIL QUEUE] ❌ Exception processing item ${item.id}:`, error);
    return { success: false, error: error?.message || String(error) };
  }
}

export async function processQueue(): Promise<{ processed: number; succeeded: number; failed: number }> {
  const now = new Date();
  const allItems = getAllEmailQueueItems();
  const itemsToProcess = allItems.filter(
    (item) =>
      item.status === "pending" || 
      (item.status === "failed" && 
       item.nextRetryAt && 
       new Date(item.nextRetryAt) <= now &&
       item.attempts < item.maxAttempts)
  );

  let succeeded = 0;
  let failed = 0;

  console.log(`[EMAIL QUEUE] Processing ${itemsToProcess.length} items with 5 minute delays...`);

  // Process items with 5 minute delay between each
  for (let i = 0; i < itemsToProcess.length; i++) {
    const item = itemsToProcess[i];
    
    // Wait 5 minutes * index before processing (except first item)
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000)); // 5 minutes
    }

    try {
      console.log(`[EMAIL QUEUE] Processing item ${item.id} (attempt ${item.attempts + 1}/${item.maxAttempts})`);
      
      const result = await sendEmail({
        to: item.to,
        subject: item.subject,
        html: item.html,
        text: item.text,
      });

      const updates: Partial<EmailQueueItem> = {
        attempts: item.attempts + 1,
        lastAttemptAt: new Date().toISOString(),
      };

      if (result.success) {
        updates.status = "sent";
        succeeded++;
        console.log(`[EMAIL QUEUE] ✅ Successfully sent email ${item.id}`);
      } else {
        updates.status = "failed";
        updates.error = 'error' in result ? result.error : 'Unknown error';
        
        // Schedule next retry for tomorrow
        const nextRetry = new Date(now);
        nextRetry.setDate(nextRetry.getDate() + 1);
        updates.nextRetryAt = nextRetry.toISOString();
        
        failed++;
        const errorMsg = 'error' in result ? result.error : 'Unknown error';
        console.log(`[EMAIL QUEUE] ❌ Failed to send email ${item.id}: ${errorMsg}`);
      }

      updateEmailQueueItem(item.id, updates);
    } catch (error: any) {
      const updates: Partial<EmailQueueItem> = {
        attempts: item.attempts + 1,
        status: "failed",
        error: error?.message || String(error),
        lastAttemptAt: new Date().toISOString(),
      };
      
      const nextRetry = new Date(now);
      nextRetry.setDate(nextRetry.getDate() + 1);
      updates.nextRetryAt = nextRetry.toISOString();
      
      updateEmailQueueItem(item.id, updates);
      
      failed++;
      console.error(`[EMAIL QUEUE] ❌ Exception processing item ${item.id}:`, error);
    }
  }

  return {
    processed: itemsToProcess.length,
    succeeded,
    failed,
  };
}

export function getQueue(): EmailQueue {
  return { items: getAllEmailQueueItems() };
}

export function removeFromQueue(id: string): boolean {
  return deleteEmailQueueItem(id);
}

