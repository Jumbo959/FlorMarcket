import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { isYooKassaConfigured } from "@/lib/yookassa";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    ...settings,
    yookassaConfigured: isYooKassaConfigured(),
  });
}
