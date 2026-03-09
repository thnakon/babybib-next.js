import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const isDeletedStr = searchParams.get('isDeleted');
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const where: any = {
      projectId: parseInt(projectId)
    };

    if (isDeletedStr !== null) {
      where.isDeleted = isDeletedStr === 'true';
    }

    const citations = await prisma.citation.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(citations);
  } catch (error) {
    console.error('GET /api/citations failed:', error); // Improved logging
    return NextResponse.json({ error: 'Failed to fetch citations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.projectId || !body.title) {
      console.error('POST /api/citations: Missing required fields (projectId or title)', body); // Added logging
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const parsedProjectId = typeof body.projectId === 'string' ? parseInt(body.projectId) : body.projectId;
    if (isNaN(parsedProjectId)) {
      console.error(`POST /api/citations: Invalid Project ID format in body: ${body.projectId}`); // Added logging
      return NextResponse.json({ error: 'Invalid Project ID format' }, { status: 400 });
    }

    const citation = await prisma.citation.create({
      data: {
        projectId: parsedProjectId,
        type: body.type || 'book',
        authors: body.authors || [],
        authorCondition: body.authorCondition || 'general',
        year: body.year?.toString() || '',
        title: body.title,
        source: body.source || '',
        url: body.url || ''
      }
    });

    return NextResponse.json(citation, { status: 201 });
  } catch (error) {
    console.error('POST /api/citations failed:', error); // Improved logging
    return NextResponse.json({ error: 'Failed to create citation' }, { status: 500 });
  }
}
