'use client';

import { Task, Project } from '@/lib/types';
import { ProjectCard } from './ProjectCard';
import { FolderOpen, Plus } from 'lucide-react';

interface ProjectsViewProps {
  tasks: Task[];
  projects: Project[];
}

export function ProjectsView({ tasks, projects }: ProjectsViewProps) {
  const activeProjects = projects.filter(project => project.status === 'active');
  const completedProjects = projects.filter(project => project.status === 'completed');

  const projectsWithTasks = projects.map(project => ({
    project,
    tasks: tasks.filter(task => task.projectId === project.projectId)
  }));

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <FolderOpen className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Projects</h1>
            </div>
            <p className="text-gray-300">
              {activeProjects.length} active projects • {completedProjects.length} completed
            </p>
          </div>
          
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map(project => {
              const projectWithTasks = projectsWithTasks.find(pt => pt.project.projectId === project.projectId);
              return (
                <ProjectCard
                  key={project.projectId}
                  project={project}
                  tasks={projectWithTasks?.tasks || []}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Completed Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map(project => {
              const projectWithTasks = projectsWithTasks.find(pt => pt.project.projectId === project.projectId);
              return (
                <ProjectCard
                  key={project.projectId}
                  project={project}
                  tasks={projectWithTasks?.tasks || []}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="glass-card p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-gray-300 mb-6">Create your first project to organize your tasks better.</p>
          <button className="btn-primary">
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}
