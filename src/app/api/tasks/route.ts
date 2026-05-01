import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    let where: any = {};
    if (projectId) {
      where.projectId = projectId;
      // ensure user has access to project
      if (session.role !== 'ADMIN') {
        const isMember = await prisma.projectMember.findFirst({
          where: { userId: session.userId, projectId },
        });
        if (!isMember) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else {
      if (session.role !== 'ADMIN') {
        where.assigneeId = session.userId;
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { title, description, status, dueDate, projectId, assigneeId } = await request.json();

    if (!title || !projectId) return NextResponse.json({ error: 'Title and projectId required' }, { status: 400 });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
