"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Block {
  type: string;
  name?: string;
  text?: string;
  url?: string;
  alt?: string;
  rows?: string[][];
}

interface BlockRendererProps {
  blocks: Block[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  // We'll iterate through blocks and group "Day" blocks into accordion items
  const renderedBlocks: React.ReactNode[] = [];
  let currentAccordion: Block[] = [];
  let currentAccordionTitle = "";
  let accordionIndex = 0;

  const flushAccordion = () => {
    if (currentAccordion.length > 0) {
      renderedBlocks.push(
        <DayAccordionItem 
          key={`accordion-${accordionIndex++}`} 
          title={currentAccordionTitle} 
          blocks={currentAccordion} 
        />
      );
      currentAccordion = [];
      currentAccordionTitle = "";
    }
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    
    // Check if it's a Day heading
    if (block.type === 'heading' && block.text?.match(/^(Day\s*\d+|Day\s*-\s*\d+)/i)) {
      flushAccordion();
      currentAccordionTitle = block.text;
    } 
    // Check if it's another major heading that breaks the accordion sequence
    else if (block.type === 'heading' && currentAccordion.length > 0 && !block.text?.match(/^(Day\s*\d+|Day\s*-\s*\d+)/i)) {
      flushAccordion();
      renderedBlocks.push(<RenderSingleBlock key={`block-${i}`} block={block} />);
    }
    // If we're inside an accordion, append it
    else if (currentAccordionTitle) {
      currentAccordion.push(block);
    } 
    // Otherwise render normally
    else {
      renderedBlocks.push(<RenderSingleBlock key={`block-${i}`} block={block} />);
    }
  }
  
  // Flush any remaining
  flushAccordion();

  return <div className="space-y-6">{renderedBlocks}</div>;
}

function RenderSingleBlock({ block }: { block: Block }) {
  if (block.type === 'paragraph') {
    return <p className="text-gray-700 leading-relaxed">{block.text}</p>;
  }
  if (block.type === 'heading') {
    const Tag = (block.name || 'h2') as React.ElementType;
    return <Tag className="text-xl font-bold text-gray-800 mt-6 mb-3">{block.text}</Tag>;
  }
  if (block.type === 'image') {
    return (
      <div className="my-6 relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-sm">
        <Image 
          src={block.url || '/images/packages/kashmir.webp'} 
          alt={block.alt || 'Package Image'} 
          fill 
          className="object-cover"
        />
      </div>
    );
  }
  if (block.type === 'table') {
    return (
      <div className="overflow-x-auto my-6 rounded-lg border border-gray-200">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <tbody className="divide-y divide-gray-200">
            {block.rows?.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-3 text-gray-700 border-r last:border-r-0 border-gray-200">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.type === 'list') {
    return <p className="text-gray-700 ml-4 border-l-2 border-legacy-orange pl-4 italic my-2">{block.text}</p>;
  }
  
  return null;
}

function DayAccordionItem({ title, blocks }: { title: string, blocks: Block[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white shadow-sm transition-all duration-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none hover:bg-gray-50 group"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-legacy-orange font-bold text-sm">
            {title.match(/\d+/) ? title.match(/\d+/)?.[0] : '*'}
          </div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-legacy-orange transition-colors">
            {title}
          </h3>
        </div>
        <div className={`p-1 rounded-full transition-transform duration-300 ${isOpen ? 'bg-orange-100 rotate-180 text-legacy-orange' : 'bg-gray-100 text-gray-500'}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 md:p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="space-y-4">
            {blocks.map((b, i) => (
              <RenderSingleBlock key={`acc-block-${i}`} block={b} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
