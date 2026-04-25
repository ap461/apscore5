import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const body = await request.text();
  
  // You can verify the webhook payload if Prismic sends the secret in the body
  // Typically Prismic sends it directly as {"secret": "...", "type": "api-update", "masterRef": "..."}
  try {
    const payload = JSON.parse(body);
    if (payload.secret !== process.env.PRISMIC_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ message: "Invalid request payload" }, { status: 400 });
  }
  revalidateTag("prismic", "max");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
