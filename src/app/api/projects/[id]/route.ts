import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: body
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

