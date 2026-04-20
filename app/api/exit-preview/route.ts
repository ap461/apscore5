import { redirectToPreviewURL } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const client = createClient();
  return redirectToPreviewURL({ client, request });
}
