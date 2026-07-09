import { prisma } from "./prisma";

export async function getSettings() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "settings" },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: "settings" },
    });
  }

  return settings;
}

export async function updateSettings(data: {
  urgentPrice?: number;
  vipPrice?: number;
  urgentDays?: number;
  vipDays?: number;
  siteName?: string;
  siteDescription?: string;
  moderationEnabled?: boolean;
}) {
  return prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: data,
    create: { id: "settings", ...data },
  });
}
