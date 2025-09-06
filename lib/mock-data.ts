import { Task, Project, User } from './types';
import { addDays, subDays } from 'date-fns';

export const mockUser: User = {
  userId: 'user_123',
  displayName: 'Alex Chen',
  farcasterUsername: 'alexchen',
};

export const mockProjects: Project[] = [
  {
    projectId: 'proj_1',
    userId: 'user_123',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website',
    status: 'active',
    createdAt: subDays(new Date(), 10),
    updatedAt: new Date(),
  },
  {
    projectId: 'proj_2',
    userId: 'user_123',
    title: 'Mobile App Launch',
    description: 'Launch new mobile application',
    status: 'active',
    createdAt: subDays(new Date(), 20),
    updatedAt: new Date(),
  },
  {
    projectId: 'proj_3',
    userId: 'user_123',
    title: 'Marketing Campaign',
    description: 'Q4 marketing campaign planning',
    status: 'completed',
    createdAt: subDays(new Date(), 30),
    updatedAt: subDays(new Date(), 5),
  },
];

export const mockTasks: Task[] = [
  {
    taskId: 'task_1',
    userId: 'user_123',
    title: 'Design homepage mockup',
    description: 'Create initial design concepts for new homepage',
    dueDate: new Date(),
    isCompleted: false,
    projectId: 'proj_1',
    createdAt: subDays(new Date(), 2),
    updatedAt: new Date(),
  },
  {
    taskId: 'task_2',
    userId: 'user_123',
    title: 'Review API documentation',
    description: 'Go through the new API docs and provide feedback',
    dueDate: new Date(),
    isCompleted: true,
    projectId: 'proj_2',
    createdAt: subDays(new Date(), 1),
    updatedAt: new Date(),
  },
  {
    taskId: 'task_3',
    userId: 'user_123',
    title: 'Setup development environment',
    description: 'Configure local dev environment for new project',
    dueDate: addDays(new Date(), 1),
    isCompleted: false,
    projectId: 'proj_2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    taskId: 'task_4',
    userId: 'user_123',
    title: 'Team standup meeting',
    description: 'Daily standup with development team',
    dueDate: new Date(),
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    taskId: 'task_5',
    userId: 'user_123',
    title: 'Code review for PR #123',
    description: 'Review pull request for authentication feature',
    dueDate: addDays(new Date(), 2),
    isCompleted: false,
    projectId: 'proj_2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
