'use client';

import { useState } from 'react';
import { X, Calendar, FolderOpen } from 'lucide-react';
import { Project } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description?: string;
    dueDate: Date;
    projectId?: string;
  }) => void;
  projects: Project[];
}

export function AddTaskModal({ isOpen, onClose, onAddTask, projects }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectId, setProjectId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: new Date(dueDate),
      projectId: projectId || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setProjectId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Optional description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 pl-10 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project (Optional)
            </label>
            <div className="relative">
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 pl-10 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="">No project</option>
                {projects.filter(p => p.status === 'active').map((project) => (
                  <option key={project.projectId} value={project.projectId} className="bg-gray-800">
                    {project.title}
                  </option>
                ))}
              </select>
              <FolderOpen className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white bg-opacity-10 text-white rounded-lg hover:bg-opacity-20 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
