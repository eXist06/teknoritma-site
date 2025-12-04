import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/services/email-verification";
import { addToQueue, processQueueItem, getQueue } from "@/lib/services/email-queue";
import { sendEmail } from "@/lib/services/email";
import fs from "fs";
import path from "path";
import { MailingList } from "@/lib/types/mailing";

const MAILING_LIST_PATH = path.join(process.cwd(), "lib/data/mailing-list.json");

function readMailingList(): MailingList {
  try {
    const data = fs.readFileSync(MAILING_LIST_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { subscribers: [] };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, organization, message, verificationCode, language = "tr" } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Verify email code
    if (!verificationCode) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    const verificationResult = verifyCode(email, verificationCode);
    if (!verificationResult.success) {
      return NextResponse.json(
        { error: verificationResult.error || "Invalid verification code" },
        { status: 400 }
      );
    }

    // Determine language-specific content
    const isEnglish = language === "en";

    // Collect queue item IDs to process
    const queueItemIds: string[] = [];

    // Add confirmation email to queue
    const confirmationHtml = isEnglish
      ? `
        <h2>Message Received</h2>
        <p>Hello ${name},</p>
        <p>We have received your message from the contact form. We will get back to you soon.</p>
        <p>Thank you!</p>
        <p>Teknoritma</p>
      `
      : `
        <h2>Mesajınız Alındı</h2>
        <p>Merhaba ${name},</p>
        <p>İletişim formunuzdan gönderdiğiniz mesajınızı aldık. En kısa sürede size dönüş yapacağız.</p>
        <p>Teşekkürler</p>
        <p>Teknoritma</p>
      `;
    const confirmationText = isEnglish
      ? `Message received. We will get back to you soon.\n\nThank you!\nTeknoritma`
      : `Mesajınız Alındı. En kısa sürede size dönüş yapacağız.\n\nTeşekkürler\nTeknoritma`;
    
    const confirmationQueueId = addToQueue(
      email, 
      isEnglish ? "Message Received - Teknoritma" : "Mesajınız Alındı - Teknoritma", 
      confirmationHtml, 
      confirmationText,
      undefined,
      undefined,
      name,
      email,
      undefined,
      message
    );
    queueItemIds.push(confirmationQueueId);

    // Send notifications to all general category subscribers immediately
    try {
      const mailingList = readMailingList();
      const generalSubscribers = mailingList.subscribers.filter(
        (subscriber) => 
          subscriber.category === "general" && 
          subscriber.active && 
          subscriber.email.toLowerCase() !== email.toLowerCase()
      );

      console.log(`[CONTACT] Found ${generalSubscribers.length} general subscribers to notify (excluding ${email})`);

      if (generalSubscribers.length === 0) {
        console.log("[CONTACT] No general subscribers to notify");
      } else {
        const notificationHtml = isEnglish
          ? `
            <h2>New Contact Form Message Notification</h2>
            <p>A new contact form message has been received by Teknoritma:</p>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              ${organization ? `<li><strong>Organization:</strong> ${organization}</li>` : ""}
              <li><strong>Message:</strong> ${message.replace(/\n/g, "<br>")}</li>
            </ul>
            <p>This helps Teknoritma grow and reach more customers. Thank you!</p>
            <p>Teknoritma</p>
          `
          : `
            <h2>Yeni İletişim Formu Mesajı Bildirimi</h2>
            <p>Teknoritma'ya yeni bir iletişim formu mesajı geldi:</p>
            <ul>
              <li><strong>Ad:</strong> ${name}</li>
              <li><strong>E-posta:</strong> ${email}</li>
              ${organization ? `<li><strong>Kurum:</strong> ${organization}</li>` : ""}
              <li><strong>Mesaj:</strong> ${message.replace(/\n/g, "<br>")}</li>
            </ul>
            <p>Bu, Teknoritma'nın büyümesine ve daha fazla müşteriye ulaşmasına yardımcı oluyor. Teşekkürler</p>
            <p>Teknoritma</p>
          `;
        const notificationText = isEnglish
          ? `New Contact Form Message Notification\n\nName: ${name}\nEmail: ${email}\n${organization ? `Organization: ${organization}\n` : ""}Message: ${message}\n\nThank you!\nTeknoritma`
          : `Yeni İletişim Formu Mesajı Bildirimi\n\nAd: ${name}\nE-posta: ${email}\n${organization ? `Kurum: ${organization}\n` : ""}Mesaj: ${message}\n\nTeşekkürler\nTeknoritma`;

        console.log(`[CONTACT] Sending notifications to ${generalSubscribers.length} subscribers immediately...`);

        // Try to send immediately, if fails add to queue
        (async () => {
          let successful = 0;
          let failed = 0;
          
          for (let index = 0; index < generalSubscribers.length; index++) {
            const subscriber = generalSubscribers[index];
            
            try {
              const subscriberGreeting = isEnglish
                ? `Hello ${subscriber.name || "Dear Subscriber"},`
                : `Merhaba ${subscriber.name || "Değerli Abonemiz"},`;
              
              console.log(`[CONTACT] Attempting to send notification to ${subscriber.email} (${index + 1}/${generalSubscribers.length})...`);
              
              const result = await sendEmail({
                to: subscriber.email,
                subject: isEnglish ? "New Contact Form Message" : "Yeni İletişim Formu Mesajı",
                html: `<p>${subscriberGreeting}</p>${notificationHtml}`,
                text: `${subscriberGreeting}\n\n${notificationText}`,
              });

              if (result.success) {
                console.log(`[CONTACT] ✅ Notification sent successfully to ${subscriber.email}`);
                successful++;
              } else {
                const errorMsg = 'error' in result ? result.error : 'Unknown error';
                console.error(`[CONTACT] ❌ Failed to send notification to ${subscriber.email}: ${errorMsg}`);
                const queueId = addToQueue(
                  subscriber.email,
                  isEnglish ? "New Contact Form Message" : "Yeni İletişim Formu Mesajı",
                  `<p>${subscriberGreeting}</p>${notificationHtml}`,
                  `${subscriberGreeting}\n\n${notificationText}`,
                  undefined,
                  undefined,
                  name,
                  email,
                  undefined,
                  message
                );
                console.log(`[CONTACT] Added failed notification to queue (ID: ${queueId}) for ${subscriber.email}`);
                failed++;
              }
            } catch (error: any) {
              console.error(`[CONTACT] ❌ Exception sending to ${subscriber.email}:`, error);
              const subscriberGreeting = isEnglish
                ? `Hello ${subscriber.name || "Dear Subscriber"},`
                : `Merhaba ${subscriber.name || "Değerli Abonemiz"},`;
              
              const queueId = addToQueue(
                subscriber.email,
                isEnglish ? "New Contact Form Message" : "Yeni İletişim Formu Mesajı",
                `<p>${subscriberGreeting}</p>${notificationHtml}`,
                `${subscriberGreeting}\n\n${notificationText}`,
                undefined,
                undefined,
                name,
                email,
                undefined,
                message
              );
              failed++;
            }
            
            // Add 5 minute delay between each email (except last)
            if (index < generalSubscribers.length - 1) {
              console.log(`[CONTACT] Waiting 5 minutes before sending next notification...`);
              await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
            }
          }
          
          console.log(`[CONTACT] ✅ Notification sending completed: ${successful} successful, ${failed} failed`);
        })().catch((error) => {
          console.error("[CONTACT] ❌ Notification sending error:", error);
        });
        
        console.log(`[CONTACT] ✅ Started sending ${generalSubscribers.length} notifications immediately (5 min intervals)`);
      }
    } catch (notificationError) {
      console.error("[CONTACT] ❌ Error sending notifications:", notificationError);
    }

    // Process queue items immediately (non-blocking)
    console.log(`[CONTACT] Processing ${queueItemIds.length} queue items...`);
    
    Promise.all(queueItemIds.map((itemId) => processQueueItem(itemId)))
      .then((results) => {
        const successful = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;
        console.log(`[CONTACT] Queue processing completed: ${successful} successful, ${failed} failed`);
      })
      .catch((error) => {
        console.error("[CONTACT] Queue processing error:", error);
      });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

