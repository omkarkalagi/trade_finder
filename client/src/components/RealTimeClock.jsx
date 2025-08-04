import React, { useState, useEffect } from 'react';

const RealTimeClock = ({ className = "" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="text-lg lg:text-xl font-bold text-green-600">
        {formatDate(currentTime)}
      </div>
      <div className="text-sm text-gray-600">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default RealTimeClock;
