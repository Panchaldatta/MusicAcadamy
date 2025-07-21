
import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = "",
  style = {}
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tracking drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for rotation and opacity based on drag
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0]);
  
  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const threshold = 100;
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      // Determine swipe direction
      const direction = offset.x > 0 ? 'right' : 'left';
      
      // Animate card off screen
      const exitX = direction === 'right' ? 1000 : -1000;
      
      // Set exiting state and animate
      setIsExiting(true);
      x.set(exitX);
      
      // Trigger callbacks after animation
      setTimeout(() => {
        if (direction === 'left' && onSwipeLeft) {
          onSwipeLeft();
        } else if (direction === 'right' && onSwipeRight) {
          onSwipeRight();
        }
        setIsVisible(false);
      }, 300);
    } else {
      // Snap back to center
      x.set(0);
      y.set(0);
    }
  }, [x, y, onSwipeLeft, onSwipeRight]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-grab active:cursor-grabbing ${className}`}
      style={{
        x,
        y,
        rotate,
        opacity: isVisible ? opacity : 0,
        scale: isVisible ? 1 : 0,
        ...style
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05 }}
      animate={{ 
        scale: isVisible && !isExiting ? 1 : 0,
        opacity: isVisible && !isExiting ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
      
      {/* Swipe indicators */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
      >
        <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          LIKE
        </div>
      </motion.div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
      >
        <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          PASS
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SwipeableCard;
