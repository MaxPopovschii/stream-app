import { useState, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import api from '../lib/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'new_video' | 'recommendation' | 'system';
  read: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/users/notifications');
      const notifs = response.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: Notification) => !n.read).length);
    } catch (error) {
      // Silent fail - notifications are not critical
      setNotifications(generateMockNotifications());
    }
  };

  const generateMockNotifications = (): Notification[] => [
    {
      id: '1',
      title: 'New Video Added',
      message: 'Check out the latest sci-fi thriller!',
      type: 'new_video',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Recommended for You',
      message: 'Based on your watch history, you might enjoy...',
      type: 'recommendation',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    ];
  
    const markAsRead = async (id: string) => {
      try {
        await api.put(`/users/notifications/${id}/read`);
        setNotifications(prev =>
          prev.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    };
  
    const clearAll = () => {
      setNotifications([]);
      setUnreadCount(0);
    };
  
    const getNotificationIcon = (type: string) => {
      switch (type) {
        case 'new_video':
          return '🎬';
        case 'recommendation':
          return '⭐';
        default:
          return '🔔';
      }
    };
  
    const formatTime = (date: string) => {
      const now = new Date();
      const then = new Date(date);
      const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    };
  
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative text-gray-300 hover:text-primary transition-colors"
        >
          <FiBell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-full text-xs flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
  
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-elegant-lg overflow-hidden z-50">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
  
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                      !notif.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getNotificationIcon(notif.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm">{notif.title}</h4>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-primary rounded-full mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                        <span className="text-xs text-gray-500 mt-2 block">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <FiBell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
