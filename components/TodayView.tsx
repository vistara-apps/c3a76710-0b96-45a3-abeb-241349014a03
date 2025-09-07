'use client';

import { Task, Project } from '@/lib/types';
import { TaskItem } from './TaskItem';
import { isTaskDueToday } from '@/lib/utils';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface TodayViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
}

export function TodayView({ tasks, projects, onToggleTask }: TodayViewProps) {
  const todayTasks = tasks.filter(task => isTaskDueToday(task.dueDate));
  const completedToday = todayTasks.filter(task => task.isCompleted);
  const pendingToday = todayTasks.filter(task => !task.isCompleted);

  const tasksWithProjects = todayTasks.map(task => ({
    task,
    project: task.projectId ? projects.find(p => p.projectId === task.projectId) : undefined
  }));

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Today&apos;s Tasks</h1>
        </div>
        <p className="text-gray-300">
          {pendingToday.length} tasks remaining • {completedToday.length} completed
        </p>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Today&apos;s Progress</h2>
          <span className="text-2xl font-bold text-white">
            {todayTasks.length > 0 ? Math.round((completedToday.length / todayTasks.length) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
            style={{ 
              width: `${todayTasks.length > 0 ? (completedToday.length / todayTasks.length) * 100 : 0}%` 
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-300 mt-2">
          <span>{completedToday.length} completed</span>
          <span>{todayTasks.length} total</span>
        </div>
      </div>

      {/* Pending Tasks */}
      {pendingToday.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Pending Tasks</h2>
          <div className="space-y-3">
            {pendingToday.map(task => {
              const taskWithProject = tasksWithProjects.find(tp => tp.task.taskId === task.taskId);
              return (
                <TaskItem
                  key={task.taskId}
                  task={task}
                  project={taskWithProject?.project}
                  onToggleComplete={onToggleTask}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedToday.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Completed Today</h2>
          <div className="space-y-3">
            {completedToday.map(task => {
              const taskWithProject = tasksWithProjects.find(tp => tp.task.taskId === task.taskId);
              return (
                <TaskItem
                  key={task.taskId}
                  task={task}
                  project={taskWithProject?.project}
                  onToggleComplete={onToggleTask}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {todayTasks.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No tasks for today</h3>
          <p className="text-gray-300">Enjoy your free day or add some tasks to get started!</p>
        </div>
      )}

      {/* All Done State */}
      {todayTasks.length > 0 && pendingToday.length === 0 && (
        <div className="glass-card p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">All done for today! 🎉</h3>
          <p className="text-gray-300">Great job completing all your tasks. Time to relax!</p>
        </div>
      )}
    </div>
  );
}
