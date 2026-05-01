import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let baseQuery: any = {};
    if (session.role !== 'ADMIN') {
      baseQuery.assigneeId = session.userId;
    }

    const tasks = await prisma.task.findMany({
      where: baseQuery,
      select: { id: true, status: true, dueDate: true }
    });

    const now = new Date();
    let overdue = 0;
    let todo = 0;
    let inProgress = 0;
    let review = 0;
    let done = 0;

    tasks.forEach(task => {
      if (task.status === 'TODO') todo++;
      else if (task.status === 'IN_PROGRESS') inProgress++;
      else if (task.status === 'REVIEW') review++;
      else if (task.status === 'DONE') done++;

      if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'DONE') {
        overdue++;
      }
    });

    return NextResponse.json({
      total: tasks.length,
      todo,
      inProgress,
      review,
      done,
      overdue,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
