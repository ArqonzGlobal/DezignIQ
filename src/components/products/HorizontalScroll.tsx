import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export const HorizontalScroll = ({ 
  children, 
  id 
}: { 
  children: React.ReactNode; 
  id: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Show left arrow if scrolled right
    setShowLeftArrow(scrollLeft > 0);
    
    // Show right arrow if there's more content to scroll
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    
    const scrollAmount = 300;
    container.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
  };

  return (
    <div className="relative">
      {showLeftArrow && (
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-gray-50 transition-all"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div 
        ref={scrollRef}
        id={id}
        className="flex overflow-x-auto gap-6 scroll-smooth no-scrollbar"
        onScroll={checkScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {children}
      </div>

      {showRightArrow && (
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-gray-50 transition-all"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};