'use client';

import { Home, Calendar, FolderOpen, Settings2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onAddTask: () => void;
}

export function Sidebar({ activeSection, onSectionChange, onAddTask }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <div className="w-64 bg-black bg-opacity-20 backdrop-blur-lg border-r border-white border-opacity-10 p-6">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded transform rotate-45"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">TaskFlow</h1>
          <p className="text-sm text-gray-300">Workflow Master</p>
        </div>
      </div>

      {/* Add Task Button */}
      <button
        onClick={onAddTask}
        className="btn-primary w-full mb-8 flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add Task</span>
      </button>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'sidebar-item w-full text-left',
                activeSection === item.id && 'bg-white bg-opacity-10'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center space-x-3 p-3 glass-card">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">AC</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Alex Chen</p>
            <p className="text-xs text-gray-300 truncate">@alexchen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
