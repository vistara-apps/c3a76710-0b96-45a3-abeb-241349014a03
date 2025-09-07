'use client';

import { Home, Calendar, FolderOpen, Settings2, Plus, User, LogOut, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskFlowStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';

export function Sidebar() {
  const {
    activeSection,
    user,
    isAuthenticated,
    hasNotificationAccess,
    hasProjectLinking,
    setActiveSection,
    openAddTaskModal,
    openAuthModal,
    openPremiumModal,
  } = useTaskFlowStore();

  const { logout } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: FolderOpen, premium: !hasProjectLinking },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  const handleAddTask = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    openAddTaskModal();
  };

  const handleMenuClick = (itemId: string, isPremium: boolean) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (isPremium) {
      openPremiumModal();
      return;
    }

    setActiveSection(itemId);
  };

  return (
    <div className="w-64 bg-black bg-opacity-20 backdrop-blur-lg border-r border-white border-opacity-10 p-6 relative">
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

      {/* User Section */}
      {isAuthenticated && user ? (
        <div className="mb-6 p-3 glass-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user.displayName}
              </p>
              <p className="text-gray-400 text-xs truncate">
                @{user.farcasterUsername}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => openPremiumModal()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs py-1.5 px-2 rounded flex items-center justify-center gap-1 hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              <Crown size={12} />
              Premium
            </button>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white p-1.5 rounded transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => openAuthModal()}
          className="btn-primary w-full mb-6 flex items-center justify-center space-x-2"
        >
          <User className="w-5 h-5" />
          <span>Connect Farcaster</span>
        </button>
      )}

      {/* Add Task Button */}
      <button
        onClick={handleAddTask}
        className="btn-primary w-full mb-8 flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add Task</span>
      </button>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isPremium = item.premium || false;
          
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, isPremium)}
              className={cn(
                'sidebar-item w-full text-left relative',
                activeSection === item.id && 'bg-white bg-opacity-10'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isPremium && (
                <Crown size={14} className="text-yellow-400 ml-auto" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Premium Features Status */}
      {isAuthenticated && (
        <div className="absolute bottom-20 left-6 right-6">
          <div className="p-3 glass-card">
            <h4 className="text-white text-sm font-medium mb-2">Premium Features</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Notifications</span>
                <span className={hasNotificationAccess ? 'text-green-400' : 'text-gray-500'}>
                  {hasNotificationAccess ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Project Linking</span>
                <span className={hasProjectLinking ? 'text-green-400' : 'text-gray-500'}>
                  {hasProjectLinking ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="text-xs text-gray-500 text-center">
          <p>TaskFlow v1.0</p>
          <p>Built on Base</p>
        </div>
      </div>
    </div>
  );
}
