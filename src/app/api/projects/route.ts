import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isArchivedStr = searchParams.get('isArchived');
    
    const where: any = {};
    if (isArchivedStr !== null) {
      where.isArchived = isArchivedStr === 'true';
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || '',
        color: body.color || '#407bc4',
        icon: body.icon || 'BookOpen',
      }
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

