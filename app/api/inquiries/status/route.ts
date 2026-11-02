import { NextRequest } from "next/server";
import { proxyInquiry } from "@/lib/booking/proxy";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  return proxyInquiry(request, "status");
}
