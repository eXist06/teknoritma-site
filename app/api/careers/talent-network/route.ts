import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { addToQueue } from "@/lib/services/email-queue";
import { sendEmail } from "@/lib/services/email";
import { verifyCode } from "@/lib/services/email-verification";
import { getMailingSubscribersByCategory } from "@/lib/db/mailing";
import { createTalentNetworkEntry } from "@/lib/db/careers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName") as string || "";
    const lastName = formData.get("lastName") as string || "";
    const email = formData.get("email") as string || "";
    const phone = formData.get("phone") as string || "";
    const jobCategory = formData.get("jobCategory") as string || "";
    const city = formData.get("city") as string || "";
    const remoteWorkplace = formData.get("remoteWorkplace") as string || "";
    const verificationCode = formData.get("verificationCode") as string || "";
    const cvFile = formData.get("cv") as File | null;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Verify email code
    if (!verificationCode) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    const verificationResult = verifyCode(email, verificationCode, "careers");
    if (!verificationResult.success) {
      return NextResponse.json(
        { error: verificationResult.error || "Invalid verification code" },
        { status: 400 }
      );
    }

    // Validate and save CV file if provided
    let cvFileName: string | null = null;
    
    if (cvFile && cvFile.size > 0) {
      // Validate file type
      if (cvFile.type !== "application/pdf") {
        return NextResponse.json({ error: "CV must be a PDF file" }, { status: 400 });
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (cvFile.size > maxSize) {
        return NextResponse.json({ error: "CV file size exceeds 10MB limit" }, { status: 400 });
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "talent-network");
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = cvFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      cvFileName = `${timestamp}_${originalName}`;
      const cvFilePath = path.join(uploadsDir, cvFileName);

      // Save file
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(cvFilePath, buffer);
    }

    // Save to database
    createTalentNetworkEntry({
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email,
      phone: phone || undefined,
      jobCategory: jobCategory || undefined,
      city: city || undefined,
      remoteWorkplace: remoteWorkplace || undefined,
      cvFileName: cvFileName || undefined,
    });

    // Collect queue item IDs to process
    const queueItemIds: string[] = [];

    // Add notifications to queue for all IK category subscribers
    try {
      const ikSubscribers = getMailingSubscribersByCategory("ik").filter(
        (subscriber) => subscriber.email.toLowerCase() !== email.toLowerCase()
      );

      console.log(`[TALENT NETWORK] Found ${ikSubscribers.length} IK subscribers to notify`);

      if (ikSubscribers.length > 0) {
        const notificationHtml = `
          <h2>Yeni Talent Network Başvurusu Bildirimi</h2>
          <p>Teknoritma'ya yeni bir talent network başvurusu geldi:</p>
          <ul>
            <li><strong>Ad:</strong> ${firstName || ""} ${lastName || ""}</li>
            <li><strong>E-posta:</strong> ${email}</li>
            ${phone ? `<li><strong>Cep Telefonu:</strong> ${phone}</li>` : ""}
            ${jobCategory ? `<li><strong>İş Kategorisi:</strong> ${jobCategory}</li>` : ""}
            ${city ? `<li><strong>Şehir:</strong> ${city}</li>` : ""}
            ${remoteWorkplace ? `<li><strong>Uzaktan/İş Yeri:</strong> ${remoteWorkplace}</li>` : ""}
            ${cvFileName ? `<li><strong>CV:</strong> Ekli dosyada</li>` : ""}
          </ul>
        `;
        const notificationText = `Yeni Talent Network Başvurusu Bildirimi\n\nAd: ${firstName || ""} ${lastName || ""}\nE-posta: ${email}\n${phone ? `Cep Telefonu: ${phone}\n` : ""}${jobCategory ? `İş Kategorisi: ${jobCategory}\n` : ""}${city ? `Şehir: ${city}\n` : ""}${remoteWorkplace ? `Uzaktan/İş Yeri: ${remoteWorkplace}\n` : ""}${cvFileName ? `CV: Ekli dosyada\n` : ""}`;

        // Send emails with attachment if CV exists
        (async () => {
          let successful = 0;
          let failed = 0;

          for (let index = 0; index < ikSubscribers.length; index++) {
            const subscriber = ikSubscribers[index];
            try {
              const subscriberGreeting = `Merhaba ${subscriber.name || "Değerli Abonemiz"},`;

              console.log(`[TALENT NETWORK] Attempting to send notification to ${subscriber.email} (${index + 1}/${ikSubscribers.length})...`);

              const attachments = cvFileName ? [{
                filename: cvFileName,
                path: path.join(process.cwd(), "public", "uploads", "talent-network", cvFileName),
              }] : undefined;

              const result = await sendEmail({
                to: subscriber.email,
                subject: "Yeni Talent Network Başvurusu",
                html: `<p>${subscriberGreeting}</p>${notificationHtml}`,
                text: `${subscriberGreeting}\n\n${notificationText}`,
                attachments,
              });

              if (result.success) {
                console.log(`[TALENT NETWORK] ✅ Notification sent successfully to ${subscriber.email}`);
                successful++;
              } else {
                const errorMsg = 'error' in result ? result.error : 'Unknown error';
                console.error(`[TALENT NETWORK] ❌ Failed to send notification to ${subscriber.email}: ${errorMsg}`);
                // Add to queue if sending fails
                const queueId = addToQueue(
                  subscriber.email,
                  "Yeni Talent Network Başvurusu",
                  `<p>${subscriberGreeting}</p>${notificationHtml}`,
                  `${subscriberGreeting}\n\n${notificationText}`,
                  undefined,
                  undefined,
                  `${firstName || ""} ${lastName || ""}`.trim(),
                  email,
                  phone,
                  undefined
                );
                console.log(`[TALENT NETWORK] Added failed notification to queue (ID: ${queueId}) for ${subscriber.email}`);
                failed++;
              }
            } catch (error: any) {
              console.error(`[TALENT NETWORK] ❌ Exception sending to ${subscriber.email}:`, error);
              // Add to queue if exception occurs
              const subscriberGreeting = `Merhaba ${subscriber.name || "Değerli Abonemiz"},`;
              const queueId = addToQueue(
                subscriber.email,
                "Yeni Talent Network Başvurusu",
                `<p>${subscriberGreeting}</p>${notificationHtml}`,
                `${subscriberGreeting}\n\n${notificationText}`,
                undefined,
                undefined,
                `${firstName || ""} ${lastName || ""}`.trim(),
                email,
                phone,
                undefined
              );
              console.log(`[TALENT NETWORK] Added exception notification to queue (ID: ${queueId}) for ${subscriber.email}`);
              failed++;
            }

            // Add 5 minute delay between each email (except last)
            if (index < ikSubscribers.length - 1) {
              console.log(`[TALENT NETWORK] Waiting 5 minutes before sending next notification...`);
              await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
            }
          }

          console.log(`[TALENT NETWORK] ✅ Notification sending completed: ${successful} successful, ${failed} failed (failed ones added to queue)`);
        })().catch((error) => {
          console.error("[TALENT NETWORK] ❌ Notification sending error:", error);
        });

        console.log(`[TALENT NETWORK] ✅ Started sending ${ikSubscribers.length} notifications immediately (5 min intervals)`);
      }
    } catch (notificationError) {
      console.error("[TALENT NETWORK] ❌ Error adding notifications to queue:", notificationError);
    }

    return NextResponse.json({ success: true, message: "Successfully joined talent network" });
  } catch (error) {
    console.error("Failed to save talent network entry:", error);
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}
