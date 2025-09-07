'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { TodayView } from '@/components/TodayView';
import { ProjectsView } from '@/components/ProjectsView';
import { AddTaskModal } from '@/components/AddTaskModal';
import { AuthModal } from '@/components/AuthModal';
import { PremiumModal } from '@/components/PremiumModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTaskFlowStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';
import { useData } from '@/lib/hooks/useData';

export default function TaskFlowApp() {
  const { setFrameReady } = useMiniKit();
  const {
    activeSection,
    isLoading,
    error,
    isAuthenticated,
    user,
    tasks,
    projects,
    isAddTaskModalOpen,
    setActiveSection,
    toggleTask,
    setAddTaskModalOpen,
    addTask,
  } = useTaskFlowStore();

  const { initializeAuth } = useAuth();
  const { loadUserData } = useData();

  // Initialize MiniKit frame and authentication
  useEffect(() => {
    const initialize = async () => {
      try {
        setFrameReady();
        await initializeAuth();
        if (isAuthenticated) {
          await loadUserData();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, [setFrameReady, initializeAuth, loadUserData, isAuthenticated]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">⚠️ Error</div>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'today':
        return <TodayView tasks={tasks} projects={projects} onToggleTask={toggleTask} />;
      case 'projects':
        return <ProjectsView tasks={tasks} projects={projects} />;
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
        return <Dashboard tasks={tasks} projects={projects} onToggleTask={toggleTask} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex">
      <Sidebar />
      {renderContent()}
      
      {/* Modals */}
      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        onAddTask={(taskData) => {
          const newTask = {
            taskId: `task-${Date.now()}`,
            userId: user?.userId || 'anonymous',
            title: taskData.title,
            description: taskData.description || '',
            isCompleted: false,
            dueDate: taskData.dueDate,
            projectId: taskData.projectId,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          addTask(newTask);
          setAddTaskModalOpen(false);
        }}
        projects={projects}
      />
      <AuthModal />
      <PremiumModal />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1b4b',
            color: '#f8fafc',
            border: '1px solid #8b5cf6',
          },
        }}
      />
    </div>
  );
}
