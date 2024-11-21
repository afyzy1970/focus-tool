import React, { useState, useEffect, useRef } from 'react';
import { Pin, Minimize, Maximize, X } from 'lucide-react';

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

  // 切换置顶状态
  const toggleAlwaysOnTop = () => {
    setIsAlwaysOnTop(!isAlwaysOnTop);
  };

  // 切换最小化状态
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      ref={windowRef}
      className={`floating-window ${isAlwaysOnTop ? 'always-on-top' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        height: isMinimized ? '40px' : 'auto',
        overflow: isMinimized ? 'hidden' : 'auto'
      }}
    >
      <div
        className="floating-window-header"
        onMouseDown={handleMouseDown}
      >
        <div className="text-sm font-medium">{title}</div>
        <div className="window-controls flex items-center space-x-2">
          <button
            onClick={toggleAlwaysOnTop}
            className={`p-1 rounded hover:bg-gray-200 ${isAlwaysOnTop ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <Pin size={14} />
          </button>
          <button
            onClick={toggleMinimize}
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