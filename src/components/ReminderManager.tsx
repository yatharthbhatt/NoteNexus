import React, { useState } from 'react';
import { Bell, Calendar, Clock, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface ReminderManagerProps {
  reminder?: Date;
  onSetReminder: (date: Date | null) => void;
}

const ReminderManager: React.FC<ReminderManagerProps> = ({ reminder, onSetReminder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const quickOptions = [
    { label: 'Later today', hours: 4 },
    { label: 'Tomorrow', hours: 24 },
    { label: 'Next week', hours: 168 },
    { label: 'Next month', hours: 720 },
  ];

  const handleQuickSet = (hours: number) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    onSetReminder(date);
    setIsOpen(false);
  };

  const handleCustomSet = () => {
    if (!selectedDate || !selectedTime) return;
    
    const date = new Date(`${selectedDate}T${selectedTime}`);
    onSetReminder(date);
    setIsOpen(false);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleRemove = () => {
    onSetReminder(null);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          reminder 
            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Bell className="w-4 h-4" />
        {reminder ? format(reminder, 'MMM d, h:mm a') : 'Remind me'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Set Reminder
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Quick Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Options</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickOptions.map(option => (
                    <button
                      key={option.label}
                      onClick={() => handleQuickSet(option.hours)}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date & Time */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Custom Date & Time</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={handleCustomSet}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Set Custom Reminder
                  </button>
                </div>
              </div>

              {/* Current Reminder */}
              {reminder && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-yellow-800">Current Reminder</div>
                      <div className="text-sm text-yellow-600">
                        {format(reminder, 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                      </div>
                    </div>
                    <button
                      onClick={handleRemove}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReminderManager;