import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [users, plants, payments, stats] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
          _count: { select: { plants: true, payments: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.plant.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.$transaction([
        prisma.user.count(),
        prisma.plant.count(),
        prisma.plant.count({ where: { status: "PENDING" } }),
        prisma.payment.count({ where: { status: "SUCCEEDED" } }),
        prisma.payment.aggregate({
          where: { status: "SUCCEEDED" },
          _sum: { amount: true },
        }),
      ]),
    ]);

    return NextResponse.json({
      users,
      plants,
      payments,
      stats: {
        totalUsers: stats[0],
        totalPlants: stats[1],
        pendingPlants: stats[2],
        successfulPayments: stats[3],
        totalRevenue: stats[4]._sum.amount || 0,
      },
    });
  } catch {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { action, id, data } = body;

    switch (action) {
      case "approve_plant":
        await prisma.plant.update({
          where: { id },
          data: { status: "APPROVED" },
        });
        break;
      case "reject_plant":
        await prisma.plant.update({
          where: { id },
          data: { status: "REJECTED" },
        });
        break;
      case "delete_user":
        await prisma.user.delete({ where: { id } });
        break;
      case "toggle_role":
        const user = await prisma.user.findUnique({ where: { id } });
        if (user) {
          await prisma.user.update({
            where: { id },
            data: { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
          });
        }
        break;
      case "update_settings":
        await prisma.siteSettings.upsert({
          where: { id: "settings" },
          update: data,
          create: { id: "settings", ...data },
        });
        break;
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка" }, { status: 403 });
  }
}
