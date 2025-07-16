import React from 'react';
import { 
  StickyNote, 
  Archive, 
  Trash2, 
  Bell, 
  Tag, 
  Plus,
  Settings,
  BarChart3,
  LogOut,
  User
} from 'lucide-react';
import { AppState, Label } from '../types';
import WorkspaceManager from './WorkspaceManager';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

interface SidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  labels: Label[];
  onAddLabel: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ state, setState, labels, onAddLabel }) => {
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'notes', label: 'Notes', icon: StickyNote, count: 0 },
    { id: 'reminders', label: 'Reminders', icon: Bell, count: 0 },
    { id: 'archive', label: 'Archive', icon: Archive, count: 0 },
    { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: 0 },
  ];

  const toggleLabelFilter = (labelId: string) => {
    setState(prev => ({
      ...prev,
      selectedLabels: prev.selectedLabels.includes(labelId)
        ? prev.selectedLabels.filter(id => id !== labelId)
        : [...prev.selectedLabels, labelId]
    }));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-gray-900 flex items-center gap-2"
        >
          <StickyNote className="w-6 h-6 text-blue-600" />
          NoteNexus
        </motion.h1>
        <p className="text-xs text-gray-500 mt-1">Advanced Note-Taking Platform</p>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500">Premium User</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setState(prev => ({ ...prev, currentView: item.id as any }))}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              state.currentView === item.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count > 0 && (
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {item.count}
              </span>
            )}
          </motion.button>
        ))}

        <div className="pt-4">
          <WorkspaceManager />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Labels
            </h3>
            <button
              onClick={onAddLabel}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-1">
            {labels.map((label, index) => (
              <motion.button
                key={label.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navItems.length + index) * 0.1 }}
                onClick={() => toggleLabelFilter(label.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  state.selectedLabels.includes(label.id)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                <span className="flex-1 text-left text-sm">{label.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        {user && (
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;