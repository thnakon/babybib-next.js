import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isArchivedStr = searchParams.get('isArchived');
    
    if (!(session.user as any).id) {
      return NextResponse.json({ error: 'User ID missing in session' }, { status: 400 });
    }

    const userId = parseInt((session.user as any).id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Check user existence
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!userExists) {
      return NextResponse.json({ error: 'Session stale, please log out and log in again' }, { status: 401 });
    }

    const where: any = {
      userId: userId
    };
    if (isArchivedStr !== null) {
      where.isArchived = isArchivedStr === 'true';
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects', details: (error as any).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    if (!(session.user as any).id) {
       return NextResponse.json({ error: 'User ID missing in session' }, { status: 400 });
    }

    const userId = parseInt((session.user as any).id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Verify user exists to handle stale sessions
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!userExists) {
      return NextResponse.json({ error: 'Session stale, please log out and log in again' }, { status: 401 });
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || '',
        color: body.color || '#407bc4',
        icon: body.icon || 'BookOpen',
        userId: userId
      }
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Project create error:', error);
    return NextResponse.json({ error: 'Failed to create project', details: (error as any).message }, { status: 500 });
  }
}

