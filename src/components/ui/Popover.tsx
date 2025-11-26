import React, { useRef, useEffect, ReactNode, MouseEvent, useState, useCallback } from 'react';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  children: ReactNode;
  title?: string;
  className?: string;
  positionStyle?: React.CSSProperties;
  align?: 'start' | 'end';
}

export const Popover: React.FC<PopoverProps> = ({ isOpen, onClose, triggerRef, children, title, className, positionStyle, align = 'end' }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [calculatedPosition, setCalculatedPosition] = useState<React.CSSProperties>({});

  const calculatePosition = useCallback(() => {
    if (triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverNode = popoverRef.current;
      
      // If offsetWidth is 0, it's likely not fully rendered yet.
      // We'll wait for ResizeObserver to kick in.
      if (popoverNode.offsetWidth === 0) return;

      const container = popoverNode.offsetParent;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const top = triggerRect.bottom - containerRect.top + 4; // 4px gap

      let left;
      if (align === 'end') {
        left = triggerRect.right - containerRect.left - popoverNode.offsetWidth;
      } else { // 'start'
        left = triggerRect.left - containerRect.left;
      }
      
      const popoverWidth = popoverNode.offsetWidth;
      const containerWidth = container.clientWidth;
      if (left < 8) {
        left = 8;
      } else if (left + popoverWidth > containerWidth - 8) {
        left = containerWidth - popoverWidth - 8;
      }

      setCalculatedPosition(currentPos => {
          const newPos = { top: `${top}px`, left: `${left}px` };
          // Avoid unnecessary re-renders if position hasn't changed
          if (currentPos.top === newPos.top && currentPos.left === newPos.left) {
              return currentPos;
          }
          return newPos;
      });
    }
  }, [triggerRef, align]);

  useEffect(() => {
    if (isOpen && !positionStyle) {
      const popoverNode = popoverRef.current;
      if (!popoverNode) return;

      const observer = new ResizeObserver(calculatePosition);
      observer.observe(popoverNode);

      // A single initial call to position the popover
      requestAnimationFrame(calculatePosition);

      return () => {
        observer.disconnect();
      };
    } else if (!isOpen) {
      setCalculatedPosition({});
    }
  }, [isOpen, positionStyle, calculatePosition]);


  // This effect handles clicks outside the popover to close it
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const handleContainerClick = (e: MouseEvent) => {
    e.stopPropagation();
  };
  
  const style = positionStyle || calculatedPosition;
  // Hide with opacity until position is calculated to avoid flicker
  const visibilityClass = !positionStyle && Object.keys(calculatedPosition).length === 0 ? 'opacity-0' : 'opacity-100';

  return (
    <div
      ref={popoverRef}
      style={style}
      className={`absolute bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-fadeIn p-4 transition-opacity ${visibilityClass} ${className || ''}`}
      onClick={handleContainerClick}
    >
      {title && (
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-2xl leading-none text-slate-400 hover:text-slate-600 transition-colors">&times;</button>
        </div>
      )}
      {children}
    </div>
  );
};
