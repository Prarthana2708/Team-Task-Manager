// import { NextResponse } from 'next/server';
// import { getSession } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const session = await getSession();
//     if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const taskId = params.id;
//     const task = await prisma.task.findUnique({ where: { id: taskId } });

//     if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

//     if (session.role !== 'ADMIN' && task.assigneeId !== session.userId) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//     }

//     const updates = await request.json();

//     // Non-admins can only update status
//     if (session.role !== 'ADMIN') {
//       const allowedUpdates = { status: updates.status };
//       const updatedTask = await prisma.task.update({
//         where: { id: taskId },
//         data: allowedUpdates,
//       });
//       return NextResponse.json({ task: updatedTask });
//     }

//     const { title, description, status, dueDate, assigneeId } = updates;
//     const updatedTask = await prisma.task.update({
//       where: { id: taskId },
//       data: {
//         title,
//         description,
//         status,
//         dueDate: dueDate ? new Date(dueDate) : null,
//         assigneeId,
//       },
//     });

//     return NextResponse.json({ task: updatedTask });
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const session = await getSession();
//     if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

//     await prisma.task.delete({
//       where: { id: params.id },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/* UPDATE TASK */
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: taskId } = await context.params;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    if (session.role !== 'ADMIN' && task.assigneeId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = await request.json();

    if (session.role !== 'ADMIN') {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status: updates.status },
      });
      return NextResponse.json({ task: updatedTask });
    }

    const { title, description, status, dueDate, assigneeId } = updates;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId,
      },
    });

    return NextResponse.json({ task: updatedTask });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* DELETE TASK */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await context.params;

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
