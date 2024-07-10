"use client";
// apps/web/src/components/MDContent/MermaidBlock.tsx

import { useEffect, useId } from 'react';

import mermaid from 'mermaid';

mermaid.initialize({});

const MermaidBlock = ({ chart }: { chart: string; id: string }) => {
  const id = useId();

  useEffect(() => {
    document.getElementById(id)?.removeAttribute('data-processed');
    mermaid.contentLoaded();
  }, [chart, id]);

  return (
    <div className="mermaid" id={id}>
      {chart}
    </div>
  );
};

export default MermaidBlock;
