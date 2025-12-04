import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { addToQueue, processQueueItem, getQueue } from "@/lib/services/email-queue";
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

const dataFilePath = path.join(process.cwd(), "lib/data/careers-data.json");

function readData() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    return { jobs: [], content: {}, talentNetwork: [] };
  }
}

function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, jobCategory, city, remoteWorkplace } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const data = readData();
    if (!data.talentNetwork) {
      data.talentNetwork = [];
    }

    const newEntry = {
      id: Date.now().toString(),
      firstName: firstName || "",
      lastName: lastName || "",
      email,
      jobCategory: jobCategory || "",
      city: city || "",
      remoteWorkplace: remoteWorkplace || "",
      createdAt: new Date().toISOString(),
    };

    data.talentNetwork.push(newEntry);
    writeData(data);

    // Collect queue item IDs to process
    const queueItemIds: string[] = [];

    // Add notifications to queue for all IK category subscribers
    try {
      const mailingList = readMailingList();
      const ikSubscribers = mailingList.subscribers.filter(
        (subscriber) => 
          subscriber.category === "ik" && 
          subscriber.active && 
          subscriber.email.toLowerCase() !== email.toLowerCase()
      );

      console.log(`[TALENT NETWORK] Found ${ikSubscribers.length} IK subscribers to notify`);

      if (ikSubscribers.length > 0) {
        const notificationHtml = `
          <h2>Yeni Talent Network Başvurusu Bildirimi</h2>
          <p>Teknoritma'ya yeni bir talent network başvurusu geldi:</p>
          <ul>
            <li><strong>Ad:</strong> ${firstName || ""} ${lastName || ""}</li>
            <li><strong>E-posta:</strong> ${email}</li>
            ${jobCategory ? `<li><strong>İş Kategorisi:</strong> ${jobCategory}</li>` : ""}
            ${city ? `<li><strong>Şehir:</strong> ${city}</li>` : ""}
          </ul>
        `;
        const notificationText = `Yeni Talent Network Başvurusu Bildirimi\n\nAd: ${firstName || ""} ${lastName || ""}\nE-posta: ${email}\n${jobCategory ? `İş Kategorisi: ${jobCategory}\n` : ""}${city ? `Şehir: ${city}\n` : ""}`;

        for (const subscriber of ikSubscribers) {
          const notificationQueueId = addToQueue(
            subscriber.email,
            "Yeni Talent Network Başvurusu",
            `<p>Merhaba ${subscriber.name || "Değerli Abonemiz"},</p>${notificationHtml}`,
            `Merhaba ${subscriber.name || "Değerli Abonemiz"},\n\n${notificationText}`,
            undefined,
            undefined,
            `${firstName || ""} ${lastName || ""}`.trim(),
            email,
            undefined,
            undefined
          );
          queueItemIds.push(notificationQueueId);
        }
        
        console.log(`[TALENT NETWORK] ✅ Added ${ikSubscribers.length} notifications to queue`);
      }
    } catch (notificationError) {
      console.error("[TALENT NETWORK] ❌ Error adding notifications to queue:", notificationError);
    }

    // Process queue items immediately (non-blocking)
    console.log(`[TALENT NETWORK] Processing ${queueItemIds.length} queue items...`);
    
    Promise.all(queueItemIds.map((itemId) => processQueueItem(itemId)))
      .then((results) => {
        const successful = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;
        console.log(`[TALENT NETWORK] Queue processing completed: ${successful} successful, ${failed} failed`);
      })
      .catch((error) => {
        console.error("[TALENT NETWORK] Queue processing error:", error);
      });

    return NextResponse.json({ success: true, message: "Successfully joined talent network" });
  } catch (error) {
    console.error("Failed to save talent network entry:", error);
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}

