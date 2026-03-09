import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const citation = await prisma.citation.update({
      where: { id: parseInt(id) },
      data: body
    });
    return NextResponse.json(citation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update citation' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    await prisma.citation.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ message: 'Citation permanently deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete citation' }, { status: 500 });
  }
}

