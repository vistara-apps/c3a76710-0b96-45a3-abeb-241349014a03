'use client';

import { Task, Project } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';
import { CheckCircle2, Circle, Calendar, FolderOpen } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  project?: Project;
  onToggleComplete: (taskId: string) => void;
  variant?: 'default' | 'compact';
}

export function TaskItem({ task, project, onToggleComplete, variant = 'default' }: TaskItemProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={cn(
      'task-item animate-fade-in',
      task.isCompleted && 'opacity-60',
      isCompact && 'p-3 mb-2'
    )}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggleComplete(task.taskId)}
          className="mt-1 text-purple-400 hover:text-purple-300 transition-colors duration-200"
        >
          {task.isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-medium text-white',
            task.isCompleted && 'line-through text-gray-400',
            isCompact ? 'text-sm' : 'text-base'
          )}>
            {task.title}
          </h3>
          
          {task.description && !isCompact && (
            <p className="text-sm text-gray-300 mt-1">{task.description}</p>
          )}

          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
            
            {project && (
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <FolderOpen className="w-3 h-3" />
                <span>{project.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
