import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    console.log("Resend request for email:", email);

    if (!email) {
      return NextResponse.json({ message: "Missing email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await prisma.user.update({
        where: { email },
        data: {
          verificationCode: newCode,
        }
      });
    } catch (updateError: any) {
      console.error("Prisma update error:", updateError);
      return NextResponse.json({ 
        message: "Failed to update verification code in database", 
        error: updateError.message || String(updateError) 
      }, { status: 500 });
    }

    console.log(`New OTP for ${email}: ${newCode}`);

    return NextResponse.json({ message: "New verification code sent" }, { status: 200 });
  } catch (error: any) {
    console.error("Resend error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message || String(error) }, { status: 500 });
  }
}
