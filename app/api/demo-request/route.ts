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
    const { name, email, organization, phone, product, message, verificationCode, language = "tr" } = body;

    if (!name || !email || !organization || !phone) {
      return NextResponse.json(
        { error: "Name, email, organization, and phone are required" },
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

    // Collect queue item IDs to process
    const queueItemIds: string[] = [];

    // Determine language-specific content
    const isEnglish = language === "en";

    // Add confirmation email to queue
    const confirmationHtml = isEnglish
      ? `
        <h2>Demo Request Received</h2>
        <p>Hello ${name},</p>
        <p>We have received your demo request. We will contact you soon to provide more information about ${product ? `our ${product} product` : "our products"}.</p>
        <p>Thank you!</p>
        <p>Teknoritma</p>
      `
      : `
        <h2>Demo Talebiniz Alındı</h2>
        <p>Merhaba ${name},</p>
        <p>Demo talebinizi aldık. ${product ? `${product} ürünümüz` : "Ürünlerimiz"} hakkında daha fazla bilgi vermek için en kısa sürede sizinle iletişime geçeceğiz.</p>
        <p>Teşekkürler</p>
        <p>Teknoritma</p>
      `;
    const confirmationText = isEnglish
      ? `Demo request received. We will contact you soon.\n\nThank you!\nTeknoritma`
      : `Demo talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.\n\nTeşekkürler\nTeknoritma`;
    
    const confirmationQueueId = addToQueue(
      email, 
      isEnglish 
        ? "Demo Request Received - Teknoritma"
        : "Demo Talebiniz Alındı - Teknoritma", 
      confirmationHtml, 
      confirmationText,
      undefined,
      undefined,
      name,
      email,
      phone,
      message
    );
    queueItemIds.push(confirmationQueueId);

    // Send notifications to all general category subscribers immediately
    // Add all to queue first, then try to send immediately
    // If sending fails, they remain in queue for retry
    try {
      const mailingList = readMailingList();
      const generalSubscribers = mailingList.subscribers.filter(
        (subscriber) => 
          subscriber.category === "general" && 
          subscriber.active && 
          subscriber.email.toLowerCase() !== email.toLowerCase()
      );

      console.log(`[DEMO REQUEST] Found ${generalSubscribers.length} general subscribers to notify (excluding ${email})`);

      if (generalSubscribers.length === 0) {
        console.log("[DEMO REQUEST] No general subscribers to notify");
      } else {
        const notificationHtml = isEnglish
          ? `
            <h2>New Demo Request Notification</h2>
            <p>A new demo request has been received by Teknoritma:</p>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Organization:</strong> ${organization}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              ${product ? `<li><strong>Product:</strong> ${product}</li>` : ""}
              ${message ? `<li><strong>Message:</strong> ${message.replace(/\n/g, "<br>")}</li>` : ""}
            </ul>
            <p>This helps Teknoritma grow and reach more customers. Thank you!</p>
            <p>Teknoritma</p>
          `
          : `
            <h2>Yeni Demo Talebi Bildirimi</h2>
            <p>Teknoritma'ya yeni bir demo talebi geldi:</p>
            <ul>
              <li><strong>Ad:</strong> ${name}</li>
              <li><strong>E-posta:</strong> ${email}</li>
              <li><strong>Kurum:</strong> ${organization}</li>
              <li><strong>Telefon:</strong> ${phone}</li>
              ${product ? `<li><strong>Ürün:</strong> ${product}</li>` : ""}
              ${message ? `<li><strong>Mesaj:</strong> ${message.replace(/\n/g, "<br>")}</li>` : ""}
            </ul>
            <p>Bu, Teknoritma'nın büyümesine ve daha fazla müşteriye ulaşmasına yardımcı oluyor. Teşekkürler</p>
            <p>Teknoritma</p>
          `;
        const notificationText = isEnglish
          ? `New Demo Request Notification\n\nName: ${name}\nEmail: ${email}\nOrganization: ${organization}\nPhone: ${phone}\n${product ? `Product: ${product}\n` : ""}${message ? `Message: ${message}\n` : ""}\nThank you!\nTeknoritma`
          : `Yeni Demo Talebi Bildirimi\n\nAd: ${name}\nE-posta: ${email}\nKurum: ${organization}\nTelefon: ${phone}\n${product ? `Ürün: ${product}\n` : ""}${message ? `Mesaj: ${message}\n` : ""}\nTeşekkürler\nTeknoritma`;

        console.log(`[DEMO REQUEST] Sending notifications to ${generalSubscribers.length} subscribers immediately...`);

        // Try to send immediately, if fails add to queue
        // Process sequentially to avoid rate limiting issues
        (async () => {
          let successful = 0;
          let failed = 0;
          
          for (let index = 0; index < generalSubscribers.length; index++) {
            const subscriber = generalSubscribers[index];
            
            try {
              const subscriberGreeting = isEnglish
                ? `Hello ${subscriber.name || "Dear Subscriber"},`
                : `Merhaba ${subscriber.name || "Değerli Abonemiz"},`;
              
              console.log(`[DEMO REQUEST] Attempting to send notification to ${subscriber.email} (${index + 1}/${generalSubscribers.length})...`);
              
              const result = await sendEmail({
                to: subscriber.email,
                subject: isEnglish
                  ? `New Demo Request - ${product || "General"}`
                  : `Yeni Demo Talebi - ${product || "Genel"}`,
                html: `<p>${subscriberGreeting}</p>${notificationHtml}`,
                text: `${subscriberGreeting}\n\n${notificationText}`,
              });

              if (result.success) {
                console.log(`[DEMO REQUEST] ✅ Notification sent successfully to ${subscriber.email}`);
                successful++;
              } else {
                const errorMsg = 'error' in result ? result.error : 'Unknown error';
                console.error(`[DEMO REQUEST] ❌ Failed to send notification to ${subscriber.email}: ${errorMsg}`);
                // Add to queue for retry next day if SMTP failed
                const subscriberGreeting = isEnglish
                  ? `Hello ${subscriber.name || "Dear Subscriber"},`
                  : `Merhaba ${subscriber.name || "Değerli Abonemiz"},`;
                
                const queueId = addToQueue(
                  subscriber.email,
                  isEnglish
                    ? `New Demo Request - ${product || "General"}`
                    : `Yeni Demo Talebi - ${product || "Genel"}`,
                  `<p>${subscriberGreeting}</p>${notificationHtml}`,
                  `${subscriberGreeting}\n\n${notificationText}`,
                  undefined,
                  undefined,
                  name,
                  email,
                  phone,
                  message
                );
                console.log(`[DEMO REQUEST] Added failed notification to queue (ID: ${queueId}) for ${subscriber.email}`);
                failed++;
              }
            } catch (error: any) {
              console.error(`[DEMO REQUEST] ❌ Exception sending to ${subscriber.email}:`, error);
              // Add to queue on exception
              const subscriberGreeting = isEnglish
                ? `Hello ${subscriber.name || "Dear Subscriber"},`
                : `Merhaba ${subscriber.name || "Değerli Abonemiz"},`;
              
              const queueId = addToQueue(
                subscriber.email,
                isEnglish
                  ? `New Demo Request - ${product || "General"}`
                  : `Yeni Demo Talebi - ${product || "Genel"}`,
                `<p>${subscriberGreeting}</p>${notificationHtml}`,
                `${subscriberGreeting}\n\n${notificationText}`,
                undefined,
                undefined,
                name,
                email,
                phone,
                message
              );
              console.log(`[DEMO REQUEST] Added exception notification to queue (ID: ${queueId}) for ${subscriber.email}`);
              failed++;
            }
            
            // Add 5 minute delay between each email (except last)
            if (index < generalSubscribers.length - 1) {
              console.log(`[DEMO REQUEST] Waiting 5 minutes before sending next notification...`);
              await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // 5 minutes
            }
          }
          
          console.log(`[DEMO REQUEST] ✅ Notification sending completed: ${successful} successful, ${failed} failed (failed ones added to queue)`);
        })().catch((error) => {
          console.error("[DEMO REQUEST] ❌ Notification sending error:", error);
        });
        
        console.log(`[DEMO REQUEST] ✅ Started sending ${generalSubscribers.length} notifications immediately (5 min intervals)`);
      }
    } catch (notificationError) {
      console.error("[DEMO REQUEST] ❌ Error adding notifications to queue:", notificationError);
      // Don't fail the request if notification fails
    }

    // Process queue items immediately (non-blocking)
    // Process the items we just added to queue
    console.log(`[DEMO REQUEST] Processing ${queueItemIds.length} queue items...`);
    
    Promise.all(queueItemIds.map((itemId) => processQueueItem(itemId)))
      .then((results) => {
        const successful = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;
        console.log(`[DEMO REQUEST] Queue processing completed: ${successful} successful, ${failed} failed`);
      })
      .catch((error) => {
        console.error("[DEMO REQUEST] Queue processing error:", error);
      });

    return NextResponse.json({
      success: true,
      message: "Demo request submitted successfully",
    });
  } catch (error) {
    console.error("Demo request error:", error);
    return NextResponse.json(
      { error: "Failed to submit demo request" },
      { status: 500 }
    );
  }
}

