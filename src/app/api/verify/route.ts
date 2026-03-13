import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, code } = body;

    console.log(`Verification attempt for ${email} with code ${code}`);

    if (!email || !code) {
      return NextResponse.json({ message: "Missing email or code" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ message: "Invalid verification code" }, { status: 400 });
    }

    try {
      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: new Date(),
          verificationCode: null,
        }
      });
    } catch (updateError: any) {
      console.error("Prisma update error (verify):", updateError);
      return NextResponse.json({ 
        message: "Failed to update verification status in database", 
        error: updateError.message || String(updateError) 
      }, { status: 500 });
    }

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message || String(error) }, { status: 500 });
  }
}
