import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/services/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'home';
  const userId = searchParams.get('userId');

  // Generate SVG image based on action
  const svg = await generateFrameImage(action, userId);

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
    },
  });
}

async function generateFrameImage(action: string, userId?: string): Promise<string> {
  const width = 1200;
  const height = 630;
  
  // Base colors from design system
  const colors = {
    bg: '#1e1b4b', // Deep purple
    surface: '#312e81', // Lighter purple
    accent: '#8b5cf6', // Purple accent
    primary: '#3b82f6', // Blue primary
    text: '#f8fafc', // Light text
    textSecondary: '#cbd5e1', // Secondary text
  };

  let content = '';
  let stats = '';

  // Get user data and stats if userId is provided
  if (userId) {
    try {
      const tasks = await databaseService.getTasksByUserId(userId);
      const projects = await databaseService.getProjectsByUserId(userId);
      
      const completedTasks = tasks.filter(task => task.isCompleted).length;
      const todayTasks = tasks.filter(task => {
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === today.toDateString();
      }).length;

      stats = `
        <g>
          <rect x="50" y="450" width="300" height="120" rx="12" fill="${colors.surface}" opacity="0.8"/>
          <text x="70" y="480" fill="${colors.text}" font-size="16" font-weight="600">Your Stats</text>
          <text x="70" y="510" fill="${colors.textSecondary}" font-size="14">Total Tasks: ${tasks.length}</text>
          <text x="70" y="535" fill="${colors.textSecondary}" font-size="14">Completed: ${completedTasks}</text>
          <text x="70" y="560" fill="${colors.textSecondary}" font-size="14">Due Today: ${todayTasks}</text>
        </g>
      `;
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }

  switch (action) {
    case 'home':
      content = `
        <text x="600" y="200" text-anchor="middle" fill="${colors.text}" font-size="48" font-weight="700">TaskFlow</text>
        <text x="600" y="250" text-anchor="middle" fill="${colors.textSecondary}" font-size="24">Your daily tasks, clearer than ever</text>
        <text x="600" y="300" text-anchor="middle" fill="${colors.accent}" font-size="18">Master your workflow, on-chain</text>
        
        <!-- Feature icons -->
        <g transform="translate(400, 350)">
          <circle cx="0" cy="0" r="30" fill="${colors.primary}" opacity="0.2"/>
          <text x="0" y="8" text-anchor="middle" fill="${colors.primary}" font-size="24">📅</text>
          <text x="0" y="60" text-anchor="middle" fill="${colors.textSecondary}" font-size="12">Today's Tasks</text>
        </g>
        
        <g transform="translate(500, 350)">
          <circle cx="0" cy="0" r="30" fill="${colors.accent}" opacity="0.2"/>
          <text x="0" y="8" text-anchor="middle" fill="${colors.accent}" font-size="24">➕</text>
          <text x="0" y="60" text-anchor="middle" fill="${colors.textSecondary}" font-size="12">Add Task</text>
        </g>
        
        <g transform="translate(600, 350)">
          <circle cx="0" cy="0" r="30" fill="${colors.primary}" opacity="0.2"/>
          <text x="0" y="8" text-anchor="middle" fill="${colors.primary}" font-size="24">📁</text>
          <text x="0" y="60" text-anchor="middle" fill="${colors.textSecondary}" font-size="12">Projects</text>
        </g>
        
        <g transform="translate(700, 350)">
          <circle cx="0" cy="0" r="30" fill="${colors.accent}" opacity="0.2"/>
          <text x="0" y="8" text-anchor="middle" fill="${colors.accent}" font-size="24">🚀</text>
          <text x="0" y="60" text-anchor="middle" fill="${colors.textSecondary}" font-size="12">Open App</text>
        </g>
      `;
      break;

    case 'today':
      content = `
        <text x="600" y="150" text-anchor="middle" fill="${colors.text}" font-size="42" font-weight="700">📅 Today's Tasks</text>
        <text x="600" y="200" text-anchor="middle" fill="${colors.textSecondary}" font-size="20">Stay focused on what matters today</text>
        
        <rect x="300" y="250" width="600" height="200" rx="16" fill="${colors.surface}" opacity="0.6"/>
        <text x="600" y="290" text-anchor="middle" fill="${colors.text}" font-size="18" font-weight="600">Your Daily Focus</text>
        <text x="600" y="320" text-anchor="middle" fill="${colors.textSecondary}" font-size="16">✓ Complete high-priority tasks</text>
        <text x="600" y="350" text-anchor="middle" fill="${colors.textSecondary}" font-size="16">✓ Review project progress</text>
        <text x="600" y="380" text-anchor="middle" fill="${colors.textSecondary}" font-size="16">✓ Plan tomorrow's priorities</text>
        <text x="600" y="420" text-anchor="middle" fill="${colors.accent}" font-size="14">Tap "Add Task" to create new items</text>
      `;
      break;

    case 'add_task':
      content = `
        <text x="600" y="150" text-anchor="middle" fill="${colors.text}" font-size="42" font-weight="700">➕ Add New Task</text>
        <text x="600" y="200" text-anchor="middle" fill="${colors.textSecondary}" font-size="20">What needs to be done?</text>
        
        <rect x="250" y="280" width="700" height="80" rx="12" fill="${colors.surface}" stroke="${colors.accent}" stroke-width="2"/>
        <text x="600" y="330" text-anchor="middle" fill="${colors.textSecondary}" font-size="18">Enter your task title in the input field</text>
        
        <text x="600" y="420" text-anchor="middle" fill="${colors.accent}" font-size="16">💡 Pro tip: Be specific for better productivity</text>
      `;
      break;

    case 'task_added':
      content = `
        <text x="600" y="150" text-anchor="middle" fill="${colors.text}" font-size="42" font-weight="700">✅ Task Added!</text>
        <text x="600" y="200" text-anchor="middle" fill="${colors.accent}" font-size="20">Great job staying organized</text>
        
        <circle cx="600" cy="320" r="60" fill="${colors.accent}" opacity="0.2"/>
        <text x="600" y="335" text-anchor="middle" fill="${colors.accent}" font-size="48">✓</text>
        
        <text x="600" y="420" text-anchor="middle" fill="${colors.textSecondary}" font-size="16">Your task has been added to today's list</text>
        <text x="600" y="450" text-anchor="middle" fill="${colors.textSecondary}" font-size="14">Open the app to manage and complete your tasks</text>
      `;
      break;

    case 'projects':
      content = `
        <text x="600" y="150" text-anchor="middle" fill="${colors.text}" font-size="42" font-weight="700">📁 Projects</text>
        <text x="600" y="200" text-anchor="middle" fill="${colors.textSecondary}" font-size="20">Organize tasks by project</text>
        
        <g transform="translate(300, 280)">
          <rect x="0" y="0" width="180" height="120" rx="12" fill="${colors.surface}" opacity="0.8"/>
          <text x="90" y="30" text-anchor="middle" fill="${colors.text}" font-size="16" font-weight="600">Website</text>
          <text x="90" y="55" text-anchor="middle" fill="${colors.textSecondary}" font-size="12">5 tasks</text>
          <rect x="20" y="70" width="140" height="8" rx="4" fill="${colors.bg}"/>
          <rect x="20" y="70" width="84" height="8" rx="4" fill="${colors.primary}"/>
        </g>
        
        <g transform="translate(510, 280)">
          <rect x="0" y="0" width="180" height="120" rx="12" fill="${colors.surface}" opacity="0.8"/>
          <text x="90" y="30" text-anchor="middle" fill="${colors.text}" font-size="16" font-weight="600">Mobile App</text>
          <text x="90" y="55" text-anchor="middle" fill="${colors.textSecondary}" font-size="12">3 tasks</text>
          <rect x="20" y="70" width="140" height="8" rx="4" fill="${colors.bg}"/>
          <rect x="20" y="70" width="56" height="8" rx="4" fill="${colors.accent}"/>
        </g>
        
        <g transform="translate(720, 280)">
          <rect x="0" y="0" width="180" height="120" rx="12" fill="${colors.surface}" opacity="0.8"/>
          <text x="90" y="30" text-anchor="middle" fill="${colors.text}" font-size="16" font-weight="600">Marketing</text>
          <text x="90" y="55" text-anchor="middle" fill="${colors.textSecondary}" font-size="12">2 tasks</text>
          <rect x="20" y="70" width="140" height="8" rx="4" fill="${colors.bg}"/>
          <rect x="20" y="70" width="140" height="8" rx="4" fill="${colors.accent}"/>
        </g>
        
        <text x="600" y="450" text-anchor="middle" fill="${colors.textSecondary}" font-size="14">💎 Project linking requires premium subscription</text>
      `;
      break;

    case 'open_app':
      content = `
        <text x="600" y="150" text-anchor="middle" fill="${colors.text}" font-size="42" font-weight="700">🚀 Opening TaskFlow</text>
        <text x="600" y="200" text-anchor="middle" fill="${colors.textSecondary}" font-size="20">Get the full experience</text>
        
        <circle cx="600" cy="320" r="80" fill="${colors.accent}" opacity="0.2"/>
        <text x="600" y="335" text-anchor="middle" fill="${colors.accent}" font-size="64">🚀</text>
        
        <text x="600" y="420" text-anchor="middle" fill="${colors.textSecondary}" font-size="16">Click the button below to launch the full app</text>
        <text x="600" y="450" text-anchor="middle" fill="${colors.accent}" font-size="14">Complete task management • Project tracking • Analytics</text>
      `;
      break;

    case 'error':
      content = `
        <text x="600" y="200" text-anchor="middle" fill="${colors.text}" font-size="42" font-weight="700">⚠️ Oops!</text>
        <text x="600" y="250" text-anchor="middle" fill="${colors.textSecondary}" font-size="20">Something went wrong</text>
        <text x="600" y="320" text-anchor="middle" fill="${colors.textSecondary}" font-size="16">Don't worry, let's get you back on track</text>
        <text x="600" y="380" text-anchor="middle" fill="${colors.accent}" font-size="14">Try going back to home or refresh the frame</text>
      `;
      break;

    default:
      content = `
        <text x="600" y="315" text-anchor="middle" fill="${colors.text}" font-size="48" font-weight="700">TaskFlow</text>
      `;
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bgGradient)"/>
      
      <!-- Decorative elements -->
      <circle cx="100" cy="100" r="50" fill="${colors.accent}" opacity="0.1"/>
      <circle cx="1100" cy="530" r="80" fill="${colors.primary}" opacity="0.1"/>
      
      <!-- Content -->
      ${content}
      
      <!-- Stats (if available) -->
      ${stats}
      
      <!-- Footer -->
      <text x="600" y="600" text-anchor="middle" fill="${colors.textSecondary}" font-size="12" opacity="0.7">TaskFlow • Master your workflow, on-chain</text>
    </svg>
  `;
}
