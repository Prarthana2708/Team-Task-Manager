import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let projects;
    if (session.role === 'ADMIN') {
      projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } else {
      const userProjects = await prisma.projectMember.findMany({
        where: { userId: session.userId },
        include: { project: true },
      });
      projects = userProjects.map(up => up.project);
    }

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { name, description, memberIds } = await request.json();

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          create: (memberIds || []).map((id: string) => ({ userId: id })),
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
