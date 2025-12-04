import fs from "fs";
import path from "path";
import { EmailQueueItem, EmailQueue } from "@/lib/types/email-queue";
import { sendEmail } from "./email";

const QUEUE_PATH = path.join(process.cwd(), "lib/data/email-queue.json");

function readQueue(): EmailQueue {
  try {
    const data = fs.readFileSync(QUEUE_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { items: [] };
  }
}

function writeQueue(queue: EmailQueue) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2), "utf8");
}

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
  const queue = readQueue();
  const item: EmailQueueItem = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    createdAt: new Date().toISOString(),
    attempts: 0,
    maxAttempts: 7, // Try for 7 days
    status: "pending",
  };
  
  queue.items.push(item);
  writeQueue(queue);
  console.log(`[EMAIL QUEUE] Added email to queue: ${item.id} -> ${to}`);
  return item.id;
}

// Process a single queue item immediately
export async function processQueueItem(itemId: string): Promise<{ success: boolean; error?: string }> {
  const queue = readQueue();
  const item = queue.items.find((i) => i.id === itemId);
  
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

    item.attempts += 1;
    item.lastAttemptAt = new Date().toISOString();

    if (result.success) {
      item.status = "sent";
      console.log(`[EMAIL QUEUE] ✅ Successfully sent email ${item.id}`);
    } else {
      item.status = "failed";
      item.error = 'error' in result ? result.error : 'Unknown error';
      
      // Schedule next retry for tomorrow
      const nextRetry = new Date();
      nextRetry.setDate(nextRetry.getDate() + 1);
      item.nextRetryAt = nextRetry.toISOString();
      
      const errorMsg = 'error' in result ? result.error : 'Unknown error';
      console.log(`[EMAIL QUEUE] ❌ Failed to send email ${item.id}: ${errorMsg}`);
    }

    // Update queue
    const itemIndex = queue.items.findIndex((i) => i.id === itemId);
    if (itemIndex >= 0) {
      queue.items[itemIndex] = item;
    }

    // Remove sent items
    queue.items = queue.items.filter(
      (item) => item.status !== "sent" && item.attempts < item.maxAttempts
    );

    writeQueue(queue);

    const errorMsg = result.success ? undefined : ('error' in result ? result.error : 'Unknown error');
    return { success: result.success || false, error: errorMsg };
  } catch (error: any) {
    item.attempts += 1;
    item.status = "failed";
    item.error = error?.message || String(error);
    item.lastAttemptAt = new Date().toISOString();
    
    const nextRetry = new Date();
    nextRetry.setDate(nextRetry.getDate() + 1);
    item.nextRetryAt = nextRetry.toISOString();
    
    const itemIndex = queue.items.findIndex((i) => i.id === itemId);
    if (itemIndex >= 0) {
      queue.items[itemIndex] = item;
    }
    writeQueue(queue);
    
    console.error(`[EMAIL QUEUE] ❌ Exception processing item ${item.id}:`, error);
    return { success: false, error: error?.message || String(error) };
  }
}

export async function processQueue(): Promise<{ processed: number; succeeded: number; failed: number }> {
  const queue = readQueue();
  const now = new Date();
  const itemsToProcess = queue.items.filter(
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

      item.attempts += 1;
      item.lastAttemptAt = new Date().toISOString();

      if (result.success) {
        item.status = "sent";
        succeeded++;
        console.log(`[EMAIL QUEUE] ✅ Successfully sent email ${item.id}`);
      } else {
        item.status = "failed";
        item.error = 'error' in result ? result.error : 'Unknown error';
        
        // Schedule next retry for tomorrow
        const nextRetry = new Date(now);
        nextRetry.setDate(nextRetry.getDate() + 1);
        item.nextRetryAt = nextRetry.toISOString();
        
        failed++;
        const errorMsg = 'error' in result ? result.error : 'Unknown error';
        console.log(`[EMAIL QUEUE] ❌ Failed to send email ${item.id}: ${errorMsg}`);
      }

      // Update queue
      const itemIndex = queue.items.findIndex((i) => i.id === item.id);
      if (itemIndex >= 0) {
        queue.items[itemIndex] = item;
      }
    } catch (error: any) {
      item.attempts += 1;
      item.status = "failed";
      item.error = error?.message || String(error);
      item.lastAttemptAt = new Date().toISOString();
      
      const nextRetry = new Date(now);
      nextRetry.setDate(nextRetry.getDate() + 1);
      item.nextRetryAt = nextRetry.toISOString();
      
      // Update queue
      const itemIndex = queue.items.findIndex((i) => i.id === item.id);
      if (itemIndex >= 0) {
        queue.items[itemIndex] = item;
      }
      
      failed++;
      console.error(`[EMAIL QUEUE] ❌ Exception processing item ${item.id}:`, error);
    }

    // Remove sent items after each processing
    queue.items = queue.items.filter(
      (item) => item.status !== "sent" && item.attempts < item.maxAttempts
    );
    writeQueue(queue);
  }

  return {
    processed: itemsToProcess.length,
    succeeded,
    failed,
  };
}

export function getQueue(): EmailQueue {
  return readQueue();
}

export function removeFromQueue(id: string): boolean {
  const queue = readQueue();
  const index = queue.items.findIndex((item) => item.id === id);
  if (index >= 0) {
    queue.items.splice(index, 1);
    writeQueue(queue);
    return true;
  }
  return false;
}

