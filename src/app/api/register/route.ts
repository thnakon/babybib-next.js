import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      orgType, 
      otherOrgType, 
      province, 
      orgName, 
      isLisStudent, 
      studentId 
    } = body;

    if (!username || !email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        orgType,
        otherOrgType,
        province,
        orgName,
        isLisStudent,
        studentId,
        verificationCode,
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
