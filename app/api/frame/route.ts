import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/services/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'home';
  const userId = searchParams.get('userId');

  // Generate Frame HTML based on action
  const frameHtml = generateFrameHtml(action, userId);

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData, trustedData } = body;

    // Extract user information from Frame data
    const fid = untrustedData?.fid;
    const buttonIndex = untrustedData?.buttonIndex;
    const inputText = untrustedData?.inputText;

    if (!fid) {
      return NextResponse.json({ error: 'Missing FID' }, { status: 400 });
    }

    // Get or create user
    let user = await databaseService.getUserByFarcasterFid(fid);
    
    if (!user) {
      // For Frame interactions, we'll create a basic user record
      // Full authentication happens through the main app
      user = await databaseService.createUser({
        userId: `fid_${fid}`,
        displayName: `User ${fid}`,
        farcasterUsername: `user${fid}`,
        farcasterFid: fid,
      });
    }

    // Handle different button actions
    let responseAction = 'home';
    let message = '';

    switch (buttonIndex) {
      case 1: // View Today's Tasks
        responseAction = 'today';
        break;
      case 2: // Add New Task
        if (inputText) {
          // Create a new task with the input text
          await databaseService.createTask({
            taskId: `task_${Date.now()}`,
            userId: user.userId,
            title: inputText,
            dueDate: new Date(),
            isCompleted: false,
          });
          message = 'Task added successfully!';
          responseAction = 'task_added';
        } else {
          responseAction = 'add_task';
        }
        break;
      case 3: // View Projects
        responseAction = 'projects';
        break;
      case 4: // Open App
        responseAction = 'open_app';
        break;
      default:
        responseAction = 'home';
    }

    // Generate response Frame
    const frameHtml = generateFrameHtml(responseAction, user.userId, message);

    return new NextResponse(frameHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame POST error:', error);
    const errorFrameHtml = generateFrameHtml('error');
    return new NextResponse(errorFrameHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}

function generateFrameHtml(action: string, userId?: string, message?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_FRAME_URL || process.env.NEXT_PUBLIC_APP_URL;
  
  let title = 'TaskFlow';
  let image = `${baseUrl}/api/frame/image?action=${action}`;
  let buttons = '';
  let input = '';
  let postUrl = `${baseUrl}/api/frame`;

  switch (action) {
    case 'home':
      title = 'TaskFlow - Master Your Workflow';
      buttons = `
        <meta name="fc:frame:button:1" content="📅 Today's Tasks" />
        <meta name="fc:frame:button:2" content="➕ Add Task" />
        <meta name="fc:frame:button:3" content="📁 Projects" />
        <meta name="fc:frame:button:4" content="🚀 Open App" />
      `;
      break;
    
    case 'today':
      title = 'TaskFlow - Today\'s Tasks';
      buttons = `
        <meta name="fc:frame:button:1" content="🏠 Home" />
        <meta name="fc:frame:button:2" content="➕ Add Task" />
        <meta name="fc:frame:button:3" content="🚀 Open App" />
      `;
      break;
    
    case 'add_task':
      title = 'TaskFlow - Add New Task';
      input = '<meta name="fc:frame:input:text" content="Enter task title..." />';
      buttons = `
        <meta name="fc:frame:button:1" content="🏠 Home" />
        <meta name="fc:frame:button:2" content="✅ Create Task" />
      `;
      break;
    
    case 'task_added':
      title = 'TaskFlow - Task Added!';
      buttons = `
        <meta name="fc:frame:button:1" content="🏠 Home" />
        <meta name="fc:frame:button:2" content="📅 View Today" />
        <meta name="fc:frame:button:3" content="🚀 Open App" />
      `;
      break;
    
    case 'projects':
      title = 'TaskFlow - Projects';
      buttons = `
        <meta name="fc:frame:button:1" content="🏠 Home" />
        <meta name="fc:frame:button:2" content="➕ Add Task" />
        <meta name="fc:frame:button:3" content="🚀 Open App" />
      `;
      break;
    
    case 'open_app':
      title = 'TaskFlow - Opening App...';
      buttons = `
        <meta name="fc:frame:button:1" content="🚀 Launch TaskFlow" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="${baseUrl}" />
      `;
      break;
    
    case 'error':
      title = 'TaskFlow - Error';
      buttons = `
        <meta name="fc:frame:button:1" content="🏠 Home" />
        <meta name="fc:frame:button:2" content="🔄 Try Again" />
      `;
      break;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
        
        <!-- Frame Meta Tags -->
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="${image}" />
        <meta name="fc:frame:post_url" content="${postUrl}" />
        ${input}
        ${buttons}
        
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="Your daily tasks, clearer than ever. Master your workflow, on-chain." />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="${baseUrl}" />
        <meta property="og:type" content="website" />
        
        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="Your daily tasks, clearer than ever. Master your workflow, on-chain." />
        <meta name="twitter:image" content="${image}" />
      </head>
      <body>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
          <h1>TaskFlow</h1>
          <p>Your daily tasks, clearer than ever.</p>
          ${message ? `<p style="color: green;">${message}</p>` : ''}
          <a href="${baseUrl}" style="margin-top: 20px; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px;">
            Open TaskFlow App
          </a>
        </div>
      </body>
    </html>
  `;
}
