'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { TodayView } from '@/components/TodayView';
import { ProjectsView } from '@/components/ProjectsView';
import { AddTaskModal } from '@/components/AddTaskModal';
import { Task, Project } from '@/lib/types';
import { mockTasks, mockProjects } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

export default function TaskFlowApp() {
  const { setFrameReady } = useMiniKit();
  const [activeSection, setActiveSection] = useState('home');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [projects] = useState<Project[]>(mockProjects);

  // Initialize MiniKit frame
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.taskId === taskId
          ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date() }
          : task
      )
    );
  };

  const handleAddTask = (newTaskData: {
    title: string;
    description?: string;
    dueDate: Date;
    projectId?: string;
  }) => {
    const newTask: Task = {
      taskId: generateId(),
      userId: 'user_123',
      title: newTaskData.title,
      description: newTaskData.description,
      dueDate: newTaskData.dueDate,
      isCompleted: false,
      projectId: newTaskData.projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'today':
        return (
          <TodayView
            tasks={tasks}
            projects={projects}
            onToggleTask={handleToggleTask}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            tasks={tasks}
            projects={projects}
          />
        );
      case 'settings':
        return (
          <div className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
            <div className="glass-card p-6">
              <p className="text-gray-300">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard
            tasks={tasks}
            projects={projects}
            onToggleTask={handleToggleTask}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onAddTask={() => setIsAddTaskModalOpen(true)}
      />
      
      {renderContent()}

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
        projects={projects}
      />
    </div>
  );
}
