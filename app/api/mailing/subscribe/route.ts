import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MailingSubscriber } from "@/lib/types/mailing";
import { sendEmail } from "@/lib/services/email";

const MAILING_LIST_PATH = path.join(process.cwd(), "lib/data/mailing-list.json");

function readMailingList() {
  try {
    const data = fs.readFileSync(MAILING_LIST_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { subscribers: [] };
  }
}

function writeMailingList(data: any) {
  fs.writeFileSync(MAILING_LIST_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, organization, source = "manual", tags = [], category } = body;

    console.log("[MAILING SUBSCRIBE] Received request:", { email, name, organization, source, tags, category });

    if (!email) {
      console.error("[MAILING SUBSCRIBE] Email is required");
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const mailingList = readMailingList();
    console.log("[MAILING SUBSCRIBE] Current subscribers count:", mailingList.subscribers.length);
    
    // Determine category based on source if not provided
    let determinedCategory: "ik" | "general" = category || 
      (source === "talent-network" ? "ik" : "general");

    // Check if already subscribed
    const existingIndex = mailingList.subscribers.findIndex(
      (s: MailingSubscriber) => s.email.toLowerCase() === email.toLowerCase()
    );

    // Merge tags and remove duplicates
    const existingTags = existingIndex >= 0 ? mailingList.subscribers[existingIndex].tags || [] : [];
    const mergedTags = [...existingTags, ...tags];
    const uniqueTags = Array.from(new Set(mergedTags.filter(Boolean)));

    // If existing subscriber, preserve their category unless explicitly changed
    const finalCategory = existingIndex >= 0 && !category 
      ? mailingList.subscribers[existingIndex].category 
      : determinedCategory;

    const subscriber: MailingSubscriber = {
      id: existingIndex >= 0 
        ? mailingList.subscribers[existingIndex].id 
        : Date.now().toString(),
      email: email.toLowerCase(),
      name: name || mailingList.subscribers[existingIndex]?.name,
      organization: organization || mailingList.subscribers[existingIndex]?.organization,
      subscribedAt: existingIndex >= 0 
        ? mailingList.subscribers[existingIndex].subscribedAt 
        : new Date().toISOString(),
      source,
      category: finalCategory,
      tags: uniqueTags,
      active: true,
    };

    if (existingIndex >= 0) {
      mailingList.subscribers[existingIndex] = subscriber;
    } else {
      mailingList.subscribers.push(subscriber);
    }

    writeMailingList(mailingList);
    console.log("[MAILING SUBSCRIBE] ✅ Successfully saved subscriber:", subscriber.email);

    // Send welcome email ONLY for new subscribers (not for existing ones being updated)
    const isNewSubscriber = existingIndex < 0;
    if (isNewSubscriber) {
      try {
        const welcomeResult = await sendEmail({
          to: email,
          subject: "Teknoritma Mailing List'e Hoş Geldiniz",
          html: `
            <h2>Hoş Geldiniz!</h2>
            <p>Merhaba ${name || "Değerli Kullanıcı"},</p>
            <p>Teknoritma mailing listesine başarıyla kaydoldunuz. Size en son haberler, güncellemeler ve özel teklifler hakkında bilgi vereceğiz.</p>
            <p>Teşekkürler!</p>
          `,
          text: `Hoş Geldiniz! Teknoritma mailing listesine başarıyla kaydoldunuz.`,
        });
        
        if (welcomeResult.success) {
          console.log("[MAILING SUBSCRIBE] Welcome email sent to new subscriber");
        } else {
          const errorMsg = 'error' in welcomeResult ? welcomeResult.error : 'Unknown error';
          console.error("[MAILING SUBSCRIBE] Welcome email failed (non-critical):", errorMsg);
        }
      } catch (emailError) {
        console.error("[MAILING SUBSCRIBE] Welcome email error (non-critical):", emailError);
        // Don't fail the subscription if email fails
      }
    } else {
      console.log("[MAILING SUBSCRIBE] Subscriber already exists, skipping welcome email");
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to mailing list",
      subscriber,
    });
  } catch (error) {
    console.error("Mailing subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

