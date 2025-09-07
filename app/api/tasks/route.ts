import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/services/database';
import { generateId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const tasks = await databaseService.getTasksByUserId(userId);

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, description, dueDate, projectId } = body;

    if (!userId || !title || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, title, dueDate' },
        { status: 400 }
      );
    }

    // Validate due date
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid due date format' },
        { status: 400 }
      );
    }

    // Check if project linking is required and user has access
    if (projectId) {
      const hasProjectLinking = await databaseService.hasActiveSubscription(
        userId,
        'project_linking'
      );
      
      if (!hasProjectLinking) {
        return NextResponse.json(
          { error: 'Project linking requires premium subscription' },
          { status: 403 }
        );
      }
    }

    const task = await databaseService.createTask({
      taskId: generateId(),
      userId,
      title,
      description,
      dueDate: parsedDueDate,
      isCompleted: false,
      projectId,
    });

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, title, description, dueDate, isCompleted, projectId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Missing taskId' },
        { status: 400 }
      );
    }

    const updates: any = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (isCompleted !== undefined) updates.isCompleted = isCompleted;
    if (projectId !== undefined) updates.projectId = projectId;
    
    if (dueDate !== undefined) {
      const parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid due date format' },
          { status: 400 }
        );
      }
      updates.dueDate = parsedDueDate;
    }

    const task = await databaseService.updateTask(taskId, updates);

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Missing taskId parameter' },
        { status: 400 }
      );
    }

    await databaseService.deleteTask(taskId);

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
