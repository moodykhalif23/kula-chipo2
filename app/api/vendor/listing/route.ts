import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const body = await request.json();

    // Find the user and vendor
    const user = await prisma.user.findUnique({ where: { email }, include: { vendor: true } });
    if (!user || !user.vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Update the vendor record
    const updatedVendor = await prisma.vendor.update({
      where: { id: user.vendor.id },
      data: {
        type: body.businessType,
        description: body.description,
        address: body.address,
        phone: body.phone,
        website: body.website,
        specialties: body.specialties || [],
        hours: body.hours || {},
        image: (body.images && body.images.length > 0) ? body.images[0] : undefined,
      },
    });

    return NextResponse.json({ message: "Vendor listing updated", vendor: updatedVendor }, { status: 200 });
  } catch (error) {
    console.error("Vendor listing update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const email = session.user.email;
    // Find the user and vendor
    const user = await prisma.user.findUnique({ where: { email }, include: { vendor: { include: { menuItems: true, reviews: true, reservations: true } } } });
    if (!user || !user.vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    return NextResponse.json({ vendor: user.vendor }, { status: 200 });
  } catch (error) {
    console.error("Vendor fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 