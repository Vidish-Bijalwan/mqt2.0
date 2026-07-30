'use client';

import { useState } from 'react';
import AutoLinker from '@/components/ui/AutoLinker';

export default function DestinationDescription({ title, content }: { title: string, content: any[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!content || !Array.isArray(content) || content.length === 0) return null;

  // Render function for the blocks
  const renderBlock = (block: any, idx: number) => {
    if (block.type === 'p') return <p key={idx} className="mb-4"><AutoLinker text={block.text} /></p>;
    if (block.type === 'h2') return <h2 key={idx} className="text-xl font-bold text-gray-800 mt-6 mb-3">{block.text}</h2>;
    if (block.type === 'h3') return <h3 key={idx} className="text-lg font-bold text-gray-800 mt-4 mb-2">{block.text}</h3>;
    if (block.type === 'ul') return (
      <ul key={idx} className="list-disc pl-6 mb-4">
        {block.items.map((item: string, i: number) => (
          <li key={i} className="mb-1">{item}</li>
        ))}
      </ul>
    );
    return null;
  };

  // We show only the first paragraph if not expanded
  const firstParagraphIndex = content.findIndex(b => b.type === 'p');
  
  if (firstParagraphIndex === -1) {
    // If no paragraph, just show everything
    return (
      <div className="bg-white p-6 rounded-md border border-gray-200 mb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title} Tour Packages</h1>
        <div className="text-sm text-gray-700 leading-relaxed">
          {content.map((block, idx) => renderBlock(block, idx))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md border border-gray-200 mb-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{title} Tour Packages</h1>
      <div className="text-sm text-gray-700 leading-relaxed">
        {expanded ? (
          <>
            {content.map((block, idx) => renderBlock(block, idx))}
            <button onClick={() => setExpanded(false)} className="text-legacy-orange font-semibold hover:underline mt-2 inline-block">
              Read Less
            </button>
          </>
        ) : (
          <>
            {renderBlock(content[firstParagraphIndex], firstParagraphIndex)}
            <button onClick={() => setExpanded(true)} className="text-legacy-orange font-semibold hover:underline mt-1 inline-block">
              Read More
            </button>
          </>
        )}
      </div>
    </div>
  );
}
