class MarketStatusService {
  constructor() {
    this.indianHolidays2025 = [
      // National Holidays
      '2025-01-26', // Republic Day
      '2025-03-14', // Holi
      '2025-04-14', // Ram Navami
      '2025-04-18', // Good Friday
      '2025-05-01', // Maharashtra Day
      '2025-08-15', // Independence Day
      '2025-08-16', // Parsi New Year
      '2025-09-07', // Ganesh Chaturthi
      '2025-10-02', // Gandhi Jayanti
      '2025-10-20', // Dussehra
      '2025-11-01', // Diwali Balipratipada
      '2025-11-21', // Guru Nanak Jayanti
      '2025-12-25', // Christmas
      
      // Additional trading holidays
      '2025-01-01', // New Year
      '2025-03-13', // Holi (Dhulandi)
      '2025-04-10', // Mahavir Jayanti
      '2025-05-12', // Buddha Purnima
      '2025-07-17', // Muharram
      '2025-08-26', // Janmashtami
      '2025-09-17', // Eid-ul-Fitr
      '2025-10-31', // Diwali
      '2025-11-24', // Eid-ul-Adha
    ];
    
    this.marketTimings = {
      preOpen: { start: '09:00', end: '09:15' },
      regular: { start: '09:15', end: '15:30' },
      postClose: { start: '15:40', end: '16:00' }
    };
  }

  // Check if current date is a market holiday
  isMarketHoliday(date = new Date()) {
    const dateString = date.toISOString().split('T')[0];
    return this.indianHolidays2025.includes(dateString);
  }

  // Check if current day is weekend (Saturday/Sunday)
  isWeekend(date = new Date()) {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  }

  // Check if market is currently open
  isMarketOpen(date = new Date()) {
    // Check if it's a holiday or weekend
    if (this.isMarketHoliday(date) || this.isWeekend(date)) {
      return false;
    }

    const currentTime = this.formatTime(date);
    const regularStart = this.marketTimings.regular.start;
    const regularEnd = this.marketTimings.regular.end;

    return currentTime >= regularStart && currentTime <= regularEnd;
  }

  // Check if it's pre-market session
  isPreMarket(date = new Date()) {
    if (this.isMarketHoliday(date) || this.isWeekend(date)) {
      return false;
    }

    const currentTime = this.formatTime(date);
    const preOpenStart = this.marketTimings.preOpen.start;
    const preOpenEnd = this.marketTimings.preOpen.end;

    return currentTime >= preOpenStart && currentTime <= preOpenEnd;
  }

  // Check if it's post-market session
  isPostMarket(date = new Date()) {
    if (this.isMarketHoliday(date) || this.isWeekend(date)) {
      return false;
    }

    const currentTime = this.formatTime(date);
    const postCloseStart = this.marketTimings.postClose.start;
    const postCloseEnd = this.marketTimings.postClose.end;

    return currentTime >= postCloseStart && currentTime <= postCloseEnd;
  }

  // Get market status with detailed information
  getMarketStatus(date = new Date()) {
    const now = date;
    const dayName = now.toLocaleDateString('en-IN', { weekday: 'long' });
    
    // Check for weekend
    if (this.isWeekend(now)) {
      const nextTradingDay = this.getNextTradingDay(now);
      return {
        status: 'closed',
        reason: `Market closed - ${dayName}`,
        isOpen: false,
        nextSession: `Next trading session: ${nextTradingDay.toLocaleDateString('en-IN', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        })} at 09:15 AM`,
        color: 'red',
        icon: '🔴'
      };
    }

    // Check for holiday
    if (this.isMarketHoliday(now)) {
      const nextTradingDay = this.getNextTradingDay(now);
      return {
        status: 'closed',
        reason: 'Market closed - Holiday',
        isOpen: false,
        nextSession: `Next trading session: ${nextTradingDay.toLocaleDateString('en-IN', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        })} at 09:15 AM`,
        color: 'red',
        icon: '🏛️'
      };
    }

    // Check current time status
    if (this.isPreMarket(now)) {
      return {
        status: 'pre-market',
        reason: 'Pre-market session',
        isOpen: true,
        nextSession: 'Regular trading starts at 09:15 AM',
        color: 'yellow',
        icon: '🟡'
      };
    }

    if (this.isMarketOpen(now)) {
      const timeUntilClose = this.getTimeUntilClose(now);
      return {
        status: 'open',
        reason: 'Market is open',
        isOpen: true,
        nextSession: `Market closes in ${timeUntilClose}`,
        color: 'green',
        icon: '🟢'
      };
    }

    if (this.isPostMarket(now)) {
      return {
        status: 'post-market',
        reason: 'Post-market session',
        isOpen: false,
        nextSession: 'Next trading session: Tomorrow at 09:15 AM',
        color: 'blue',
        icon: '🔵'
      };
    }

    // Market is closed for the day
    const nextTradingDay = this.getNextTradingDay(now);
    return {
      status: 'closed',
      reason: 'Market closed for the day',
      isOpen: false,
      nextSession: `Next trading session: ${nextTradingDay.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })} at 09:15 AM`,
      color: 'red',
      icon: '🔴'
    };
  }

  // Get next trading day
  getNextTradingDay(date = new Date()) {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    while (this.isWeekend(nextDay) || this.isMarketHoliday(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }

    return nextDay;
  }

  // Get time until market closes
  getTimeUntilClose(date = new Date()) {
    const closeTime = new Date(date);
    const [hours, minutes] = this.marketTimings.regular.end.split(':');
    closeTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const timeDiff = closeTime - date;
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m`;
    } else {
      return `${minutesLeft}m`;
    }
  }

  // Format time as HH:MM
  formatTime(date) {
    return date.toTimeString().slice(0, 5);
  }

  // Get market timings for display
  getMarketTimings() {
    return {
      preOpen: '09:00 AM - 09:15 AM',
      regular: '09:15 AM - 03:30 PM',
      postClose: '03:40 PM - 04:00 PM'
    };
  }

  // Get upcoming holidays
  getUpcomingHolidays(count = 5) {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    return this.indianHolidays2025
      .filter(holiday => holiday >= todayString)
      .slice(0, count)
      .map(holiday => {
        const date = new Date(holiday);
        return {
          date: holiday,
          formatted: date.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        };
      });
  }

  // Subscribe to market status updates
  subscribe(callback) {
    const interval = setInterval(() => {
      const status = this.getMarketStatus();
      callback(status);
    }, 60000); // Update every minute

    // Return unsubscribe function
    return () => clearInterval(interval);
  }
}

const marketStatusService = new MarketStatusService();
export default marketStatusService;
