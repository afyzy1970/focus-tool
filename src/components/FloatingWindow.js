'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pin, Minimize, Maximize } from 'lucide-react';

const FloatingWindow = ({ children, title = "专注时钟" }) => {
  const [position, setPosition] = useState({ x: window?.innerWidth - 320 || 0, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const windowRef = useRef(null);

  // 处理拖动开始
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // 处理拖动
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;

      // 确保窗口不会拖出屏幕
      const maxX = window.innerWidth - (windowRef.current?.offsetWidth || 300);
      const maxY = window.innerHeight - (windowRef.current?.offsetHeight || 200);

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div
      ref={windowRef}
      className="fixed shadow-lg rounded-lg bg-white"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        height: isMinimized ? '40px' : 'auto',
        overflow: isMinimized ? 'hidden' : 'auto',
        zIndex: isAlwaysOnTop ? 9999 : 1,
        minWidth: '300px'
      }}
    >
      <div
        className="bg-gray-100 p-2 rounded-t-lg flex justify-between items-center cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="text-sm font-medium">{title}</div>
        <div className="window-controls flex items-center space-x-2">
          <button
            onClick={() => setIsAlwaysOnTop(!isAlwaysOnTop)}
            className={`p-1 rounded hover:bg-gray-200 ${isAlwaysOnTop ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <Pin size={14} />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-gray-200 text-gray-500"
          >
            {isMinimized ? <Maximize size={14} /> : <Minimize size={14} />}
          </button>
        </div>
      </div>
      <div className={`p-4 ${isMinimized ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default FloatingWindow;