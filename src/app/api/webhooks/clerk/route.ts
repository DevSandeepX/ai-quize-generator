import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deleteUser, upsertUser } from "@/server/actions/user";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    // Get headers
    const headerPayload = await headers();

    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json(
            { error: "Missing Svix headers" },
            { status: 400 }
        );
    }

    // Raw body
    const body = await req.text();

    // Verify webhook
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Webhook verification failed:", err);

        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }

    // Event info
    const eventType = evt.type;

    console.log("Webhook Verified");
    console.log("Event:", eventType);
    try {

        switch (eventType) {
            case "user.created":
            case "user.updated":
                upsertUser({
                    isApproved: false,
                    avatarUrl: evt.data.image_url,
                    name: `${evt.data.first_name} ${evt.data.last_name}`.trim(),
                    clerkId: evt.data.id,
                    email: evt.data.email_addresses.find(
                        (email) => email.id === evt.data.primary_email_address_id
                    )?.email_address ?? ""
                })
                break;

            case "user.deleted":
                if (!evt.data.id) {
                    throw new Error("Clerk id is required")
                }

                deleteUser(evt.data.id)
                break;

            default:
                console.log("Unhandled event:", eventType);
        }
        return NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.redirect("/")
    }
}