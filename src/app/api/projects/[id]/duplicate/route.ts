import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const originalProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { citations: true }
    });

    if (!originalProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { id: originalId, citations, createdAt, updatedAt, ...projectData } = originalProject;

    const duplicatedProject = await prisma.project.create({
      data: {
        ...projectData,
        name: `${projectData.name} (Copy)`,
        citations: {
          create: citations.map(({ id, projectId, createdAt, updatedAt, ...citationData }: any) => citationData)
        }
      },
      include: { citations: true }
    });

    return NextResponse.json(duplicatedProject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to duplicate project' }, { status: 500 });
  }
}
