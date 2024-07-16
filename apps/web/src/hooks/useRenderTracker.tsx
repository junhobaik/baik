import { useEffect, useRef } from 'react';

const useRenderTracker = ({ name }: { name: string }) => {
  const renderCount = useRef(0);

  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      renderCount.current += 1;
      console.debug(`[Rendered] ${name}:`, renderCount.current);
    });
  }

  return renderCount.current;
};

export default useRenderTracker;
