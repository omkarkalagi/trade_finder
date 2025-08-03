class MarketStatusService {
  constructor() {
    this.listeners = [];
    this.marketStatus = {
      isOpen: false,
      nextOpen: null,
      nextClose: null,
      timeToOpen: null,
      timeToClose: null,
      currentTime: new Date(),
      timezone: 'Asia/Kolkata'
    };

    // Start monitoring market status
    this.updateMarketStatus();
    setInterval(() => this.updateMarketStatus(), 60000); // Update every minute
  }

  // Check if Indian market is open
  isMarketOpen() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));

    const day = istTime.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const currentTime = hours * 60 + minutes; // Convert to minutes

    // Market is closed on weekends
    if (day === 0 || day === 6) {
      return false;
    }

    // Market hours: 9:15 AM to 3:30 PM IST (Monday to Friday)
    const marketOpen = 9 * 60 + 15; // 9:15 AM in minutes
    const marketClose = 15 * 60 + 30; // 3:30 PM in minutes

    return currentTime >= marketOpen && currentTime <= marketClose;
  }

  // Get next market open time
  getNextMarketOpen() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));

    let nextOpen = new Date(istTime);
    nextOpen.setHours(9, 15, 0, 0); // Set to 9:15 AM

    // If market is already open or closed for today, move to next trading day
    if (istTime.getHours() > 15 || (istTime.getHours() === 15 && istTime.getMinutes() >= 30)) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }

    // Skip weekends
    while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }

    return nextOpen;
  }

  // Get next market close time
  getNextMarketClose() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));

    let nextClose = new Date(istTime);
    nextClose.setHours(15, 30, 0, 0); // Set to 3:30 PM

    // If market is already closed for today, move to next trading day
    if (istTime.getHours() > 15 || (istTime.getHours() === 15 && istTime.getMinutes() >= 30)) {
      nextClose.setDate(nextClose.getDate() + 1);

      // Skip weekends
      while (nextClose.getDay() === 0 || nextClose.getDay() === 6) {
        nextClose.setDate(nextClose.getDate() + 1);
      }
    }

    return nextClose;
  }

  // Calculate time remaining
  getTimeRemaining(targetTime) {
    const now = new Date();
    const diff = targetTime - now;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes, total: diff };
  }

  // Update market status
  updateMarketStatus() {
    const isOpen = this.isMarketOpen();
    const nextOpen = this.getNextMarketOpen();
    const nextClose = this.getNextMarketClose();

    this.marketStatus = {
      isOpen,
      nextOpen,
      nextClose,
      timeToOpen: isOpen ? null : this.getTimeRemaining(nextOpen),
      timeToClose: isOpen ? this.getTimeRemaining(nextClose) : null,
      currentTime: new Date(),
      timezone: 'Asia/Kolkata'
    };

    // Notify listeners
    this.notifyListeners();
  }

  // Get current market status
  getMarketStatus() {
    return this.marketStatus;
  }

  // Check if it's a trading day
  isTradingDay(date = new Date()) {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday or Saturday
  }

  // Get market session info
  getMarketSession() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const currentTime = hours * 60 + minutes;

    if (!this.isTradingDay(istTime)) {
      return {
        session: 'closed',
        reason: 'Weekend',
        nextSession: 'pre-market',
        nextSessionTime: this.getNextMarketOpen()
      };
    }

    // Pre-market: Before 9:15 AM
    if (currentTime < 9 * 60 + 15) {
      return {
        session: 'pre-market',
        reason: 'Before market hours',
        nextSession: 'market',
        nextSessionTime: this.getNextMarketOpen()
      };
    }

    // Market hours: 9:15 AM to 3:30 PM
    if (currentTime >= 9 * 60 + 15 && currentTime <= 15 * 60 + 30) {
      return {
        session: 'market',
        reason: 'Market is open',
        nextSession: 'post-market',
        nextSessionTime: this.getNextMarketClose()
      };
    }

    // Post-market: After 3:30 PM
    return {
      session: 'post-market',
      reason: 'After market hours',
      nextSession: 'pre-market',
      nextSessionTime: this.getNextMarketOpen()
    };
  }

  // Subscribe to market status updates
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.marketStatus));
  }

  // Format time for display
  formatTimeRemaining(timeObj) {
    if (!timeObj) return null;

    if (timeObj.hours > 0) {
      return `${timeObj.hours}h ${timeObj.minutes}m`;
    }
    return `${timeObj.minutes}m`;
  }

  // Get market status text
  getMarketStatusText() {
    const status = this.getMarketStatus();
    const session = this.getMarketSession();

    if (status.isOpen) {
      const timeToClose = this.formatTimeRemaining(status.timeToClose);
      return {
        text: 'Market Open',
        subtext: timeToClose ? `Closes in ${timeToClose}` : 'Open',
        color: 'green',
        icon: '🟢'
      };
    }

    const timeToOpen = this.formatTimeRemaining(status.timeToOpen);
    return {
      text: 'Market Closed',
      subtext: timeToOpen ? `Opens in ${timeToOpen}` : session.reason,
      color: 'red',
      icon: '🔴'
    };
  }
}

// Create singleton instance
const marketStatusService = new MarketStatusService();

export default marketStatusService;
