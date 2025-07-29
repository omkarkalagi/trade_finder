import React, { useState, useEffect } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    loadTime: 0,
    dataSize: 0
  });
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = Date.now();
    let animationFrame;
    
    const measureFPS = () => {
      const now = Date.now();
      const delta = now - lastTime;
      
      if (delta >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / delta)
        }));
        frameCount = 0;
        lastTime = now;
      }
      
      frameCount++;
      animationFrame = requestAnimationFrame(measureFPS);
    };
    
    // Start measuring
    measureFPS();
    
    // Measure memory (browser support varies)
    if (window.performance && window.performance.memory) {
      setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          memory: (window.performance.memory.usedJSHeapSize / 1048576).toFixed(2)
        }));
      }, 5000);
    }
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white text-xs p-2 rounded-lg z-50">
      <div>FPS: {metrics.fps}</div>
      {metrics.memory > 0 && <div>Memory: {metrics.memory} MB</div>}
      {metrics.loadTime > 0 && <div>Load: {metrics.loadTime}ms</div>}
      {metrics.dataSize > 0 && <div>Data: {metrics.dataSize} KB</div>}
    </div>
  );
};

export default PerformanceMonitor; 