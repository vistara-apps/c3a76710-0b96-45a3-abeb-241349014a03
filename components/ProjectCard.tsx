'use client';

import { Project, Task } from '@/lib/types';
import { calculateCompletionRate } from '@/lib/utils';
import { FolderOpen, CheckCircle2, Clock } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  variant?: 'default' | 'compact';
}

export function ProjectCard({ project, tasks, variant = 'default' }: ProjectCardProps) {
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const completionRate = calculateCompletionRate(completedTasks, totalTasks);
  
  const isCompact = variant === 'compact';

  return (
    <div className={`project-card animate-slide-up ${isCompact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold text-white ${isCompact ? 'text-sm' : 'text-lg'}`}>
              {project.title}
            </h3>
            {project.description && !isCompact && (
              <p className="text-sm text-white text-opacity-80 mt-1">
                {project.description}
              </p>
            )}
          </div>
        </div>
        
        <div className={`text-right ${isCompact ? 'text-xs' : 'text-sm'}`}>
          <div className="text-white font-medium">{completionRate}%</div>
          <div className="text-white text-opacity-60">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1 text-white text-opacity-80">
          <CheckCircle2 className="w-4 h-4" />
          <span>{completedTasks}/{totalTasks} tasks</span>
        </div>
        
        <div className="flex items-center space-x-1 text-white text-opacity-80">
          <Clock className="w-4 h-4" />
          <span className="capitalize">{project.status}</span>
        </div>
      </div>
    </div>
  );
}
