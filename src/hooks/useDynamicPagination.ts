import { useState, useEffect, RefObject } from 'react';

/**
 * Hook to dynamically calculate the number of items that fit vertically in a container.
 * 
 * @param containerRef Ref to the container that holds the list/table
 * @param itemHeight The height of a single item (card or table row) in pixels
 * @param offset Any additional vertical offset (e.g., headers, pagination controls, margins) in pixels
 * @param defaultItems Fallback number of items if calculation fails or hasn't run yet
 */
export function useDynamicPagination(
  containerRef: RefObject<HTMLElement | null>,
  itemHeight: number,
  offset: number = 0,
  defaultItems: number = 10
) {
  const [itemsPerPage, setItemsPerPage] = useState(defaultItems);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateItems = () => {
      const container = containerRef.current;
      if (!container) return;
      
      // Calculate available height inside the container
      const availableHeight = container.clientHeight - offset;
      
      // Ensure we always show at least 1 item
      const calculatedItems = Math.max(1, Math.floor(availableHeight / itemHeight));
      
      setItemsPerPage(calculatedItems);
    };

    // Initial calculation
    calculateItems();

    // Re-calculate on window resize
    window.addEventListener('resize', calculateItems);
    
    // Also use ResizeObserver for the specific container
    const resizeObserver = new ResizeObserver(() => {
      calculateItems();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', calculateItems);
      resizeObserver.disconnect();
    };
  }, [containerRef, itemHeight, offset]);

  return itemsPerPage;
}
