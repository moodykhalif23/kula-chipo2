import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { AuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(/* req: NextRequest */) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || !session.user || typeof (session.user as { role?: string }).role !== "string" || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
    orderBy: { createdAt: "desc" },
  });
  const vendors = await prisma.vendor.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  const menuItems = await prisma.menuItem.findMany({
    include: { vendor: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true } },
      vendor: { include: { user: { select: { name: true } } } },
    },
    orderBy: { date: "desc" },
  });
  const reservations = await prisma.reservation.findMany({
    include: {
      user: { select: { name: true } },
      vendor: { include: { user: { select: { name: true } } } },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ users, vendors, menuItems, reviews, reservations });
} 