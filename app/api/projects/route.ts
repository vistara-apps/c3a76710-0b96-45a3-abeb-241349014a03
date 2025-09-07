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

    const projects = await databaseService.getProjectsByUserId(userId);

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, description, status = 'active' } = body;

    if (!userId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, title' },
        { status: 400 }
      );
    }

    // Check if user has project linking access
    const hasProjectLinking = await databaseService.hasActiveSubscription(
      userId,
      'project_linking'
    );
    
    if (!hasProjectLinking) {
      return NextResponse.json(
        { error: 'Project creation requires premium subscription' },
        { status: 403 }
      );
    }

    // Validate status
    const validStatuses = ['active', 'completed', 'paused'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: active, completed, paused' },
        { status: 400 }
      );
    }

    const project = await databaseService.createProject({
      projectId: generateId(),
      userId,
      title,
      description,
      status,
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, description, status } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId' },
        { status: 400 }
      );
    }

    const updates: any = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    
    if (status !== undefined) {
      const validStatuses = ['active', 'completed', 'paused'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: active, completed, paused' },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    const project = await databaseService.updateProject(projectId, updates);

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId parameter' },
        { status: 400 }
      );
    }

    await databaseService.deleteProject(projectId);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
