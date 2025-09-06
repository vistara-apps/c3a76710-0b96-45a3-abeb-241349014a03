'use client';

import { Task, Project, TaskStats, ProjectStats } from '@/lib/types';
import { MetricCard } from './MetricCard';
import { TaskItem } from './TaskItem';
import { ProjectCard } from './ProjectCard';
import { CheckCircle2, Clock, FolderOpen, TrendingUp, Calendar, Target } from 'lucide-react';
import { isTaskDueToday, isTaskDueThisWeek, calculateCompletionRate } from '@/lib/utils';

interface DashboardProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
}

export function Dashboard({ tasks, projects, onToggleTask }: DashboardProps) {
  // Calculate stats
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const dueTodayTasks = tasks.filter(task => isTaskDueToday(task.dueDate) && !task.isCompleted);
  const dueThisWeekTasks = tasks.filter(task => isTaskDueThisWeek(task.dueDate) && !task.isCompleted);
  const activeProjects = projects.filter(project => project.status === 'active');
  
  const completionRate = calculateCompletionRate(completedTasks, tasks.length);

  // Get tasks with their associated projects
  const tasksWithProjects = tasks.map(task => ({
    task,
    project: task.projectId ? projects.find(p => p.projectId === task.projectId) : undefined
  }));

  // Get projects with their tasks
  const projectsWithTasks = projects.map(project => ({
    project,
    tasks: tasks.filter(task => task.projectId === project.projectId)
  }));

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Good morning, Alex! 👋</h1>
        <p className="text-gray-300">You have {dueTodayTasks.length} tasks due today and {dueThisWeekTasks.length} this week.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Tasks Due Today"
          value={dueTodayTasks.length}
          icon={Calendar}
          variant="gradient"
        />
        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${completedTasks}/${tasks.length} completed`}
          icon={Target}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Active Projects"
          value={activeProjects.length}
          icon={FolderOpen}
        />
        <MetricCard
          title="This Week"
          value={dueThisWeekTasks.length}
          subtitle="Tasks remaining"
          icon={Clock}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Tasks Due Today</h2>
              <div className="text-sm text-gray-300">
                {dueTodayTasks.length} remaining
              </div>
            </div>
            
            <div className="space-y-3">
              {dueTodayTasks.length > 0 ? (
                dueTodayTasks.map(task => {
                  const taskWithProject = tasksWithProjects.find(tp => tp.task.taskId === task.taskId);
                  return (
                    <TaskItem
                      key={task.taskId}
                      task={task}
                      project={taskWithProject?.project}
                      onToggleComplete={onToggleTask}
                    />
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-300">All tasks completed for today! 🎉</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Active Projects</h2>
              <div className="text-sm text-gray-300">
                {activeProjects.length} active
              </div>
            </div>
            
            <div className="space-y-4">
              {activeProjects.slice(0, 3).map(project => {
                const projectWithTasks = projectsWithTasks.find(pt => pt.project.projectId === project.projectId);
                return (
                  <ProjectCard
                    key={project.projectId}
                    project={project}
                    tasks={projectWithTasks?.tasks || []}
                    variant="compact"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="mt-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Upcoming This Week</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dueThisWeekTasks.slice(0, 6).map(task => {
              const taskWithProject = tasksWithProjects.find(tp => tp.task.taskId === task.taskId);
              return (
                <TaskItem
                  key={task.taskId}
                  task={task}
                  project={taskWithProject?.project}
                  onToggleComplete={onToggleTask}
                  variant="compact"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
