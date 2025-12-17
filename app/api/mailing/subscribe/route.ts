import { NextRequest, NextResponse } from "next/server";
import { MailingSubscriber } from "@/lib/types/mailing";
import { sendEmail } from "@/lib/services/email";
import { getMailingSubscriberByEmail, createMailingSubscriber, updateMailingSubscriber } from "@/lib/db/mailing";

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

    // Determine category based on source if not provided
    let determinedCategory: "ik" | "general" = category || 
      (source === "talent-network" ? "ik" : "general");

    // Check if already subscribed
    const existing = getMailingSubscriberByEmail(email);

    // Merge tags and remove duplicates
    const existingTags = existing?.tags || [];
    const mergedTags = [...existingTags, ...tags];
    const uniqueTags = Array.from(new Set(mergedTags.filter(Boolean)));

    // If existing subscriber, preserve their category unless explicitly changed
    const finalCategory = existing && !category 
      ? existing.category 
      : determinedCategory;

    let subscriber: MailingSubscriber;
    const isNewSubscriber = !existing;

    if (existing) {
      subscriber = updateMailingSubscriber(existing.id, {
        name: name || existing.name,
        organization: organization || existing.organization,
        source,
        category: finalCategory,
        tags: uniqueTags,
        active: true,
      });
    } else {
      subscriber = createMailingSubscriber({
        email: email.toLowerCase(),
        name: name || undefined,
        organization: organization || undefined,
        source,
        category: finalCategory,
        tags: uniqueTags,
        active: true,
      });
    }

    console.log("[MAILING SUBSCRIBE] ✅ Successfully saved subscriber:", subscriber.email);

    // Send welcome email ONLY for new subscribers (not for existing ones being updated)
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
