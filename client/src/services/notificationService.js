class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  // Add a new notification
  addNotification(notification) {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();

    // Play notification sound
    this.playNotificationSound();

    return newNotification.id;
  }

  // Get all notifications
  getNotifications() {
    return this.notifications;
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  // Remove notification
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Subscribe to notifications
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.notifications));
  }

  // Play notification sound
  playNotificationSound() {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }

  // Predefined notification types
  notifyTrade(message, type = 'success') {
    return this.addNotification({
      type: 'trade',
      title: 'Trade Alert',
      message,
      icon: type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️',
      priority: 'high'
    });
  }

  notifyMarket(message) {
    return this.addNotification({
      type: 'market',
      title: 'Market Update',
      message,
      icon: '📈',
      priority: 'medium'
    });
  }

  notifyPortfolio(message) {
    return this.addNotification({
      type: 'portfolio',
      title: 'Portfolio Alert',
      message,
      icon: '💼',
      priority: 'medium'
    });
  }

  notifySystem(message, priority = 'low') {
    return this.addNotification({
      type: 'system',
      title: 'System Notification',
      message,
      icon: '🔔',
      priority
    });
  }

  notifyZerodha(message, type = 'info') {
    return this.addNotification({
      type: 'zerodha',
      title: 'Zerodha Update',
      message,
      icon: type === 'success' ? '🟢' : type === 'error' ? '🔴' : 'ℹ️',
      priority: 'high'
    });
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Add some sample notifications for demo
setTimeout(() => {
  notificationService.notifySystem('Welcome to Trade Finder! 🚀');
  notificationService.notifyMarket('Market opened successfully');
  notificationService.notifyTrade('RELIANCE buy order executed at ₹2,450', 'success');
}, 1000);

export default notificationService;
