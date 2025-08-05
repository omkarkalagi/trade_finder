import React, { useState, useEffect, useRef } from 'react';
import notificationService from '../services/notificationService';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe((notifications) => {
      setNotifications(notifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Initial load
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening
      setTimeout(() => {
        notificationService.markAllAsRead();
      }, 1000);
    }
  };

  const handleNotificationClick = (notification) => {
    notificationService.markAsRead(notification.id);
  };

  const handleClearAll = () => {
    notificationService.clearAll();
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      trade: <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">TRADE</span>,
      market: <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">MARKET</span>,
      portfolio: <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-medium">PORTFOLIO</span>,
      system: <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">SYSTEM</span>,
      zerodha: <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">ZERODHA</span>
    };
    return icons[type] || <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">INFO</span>;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-red-400 bg-red-500/10',
      medium: 'border-l-yellow-400 bg-yellow-500/10',
      low: 'border-l-blue-400 bg-blue-500/10'
    };
    return colors[priority] || 'border-l-gray-400 bg-gray-100';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleBellClick}
        className={`relative p-2 rounded-full transition-all duration-200 touch-manipulation ${
          unreadCount > 0
            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25 animate-pulse'
            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-sm'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 lg:h-6 lg:w-6 ${unreadCount > 0 ? 'animate-bounce' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Notification Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold animate-pulse shadow-lg shadow-red-500/50">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 lg:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">
                  <span className="bg-gray-100 text-gray-600 px-3 py-2 rounded-full text-sm font-medium">BELL</span>
                </div>
                <p>No notifications yet</p>
                <p className="text-xs mt-1 text-gray-400">You'll see trading alerts and updates here</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0">
                      {notification.icon || getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        !notification.read ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-700/30 bg-slate-800/30">
              <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
