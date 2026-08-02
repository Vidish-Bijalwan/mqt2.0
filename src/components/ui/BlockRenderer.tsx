"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface Block {
  type: string;
  level?: number;
  text?: string;
  url?: string;
  alt?: string;
  caption?: string;
  items?: string[];
  ordered?: boolean;
  rows?: string[][];
}

interface BlockRendererProps {
  blocks: Block[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  // Group "Day N" heading sequences into accordion items; render everything
  // else in document order.
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

    if (block.type === 'heading' && block.text?.match(/^(Day\s*\d+|Day\s*-\s*\d+)/i)) {
      flushAccordion();
      currentAccordionTitle = block.text;
    } else if (block.type === 'heading' && currentAccordion.length > 0 && !block.text?.match(/^(Day\s*\d+|Day\s*-\s*\d+)/i)) {
      flushAccordion();
      renderedBlocks.push(<RenderSingleBlock key={`block-${i}`} block={block} />);
    } else if (currentAccordionTitle) {
      currentAccordion.push(block);
    } else {
      renderedBlocks.push(<RenderSingleBlock key={`block-${i}`} block={block} />);
    }
  }

  flushAccordion();

  if (renderedBlocks.length === 0) {
    return <p className="text-gray-500 italic">Detailed itinerary is not available for this package.</p>;
  }

  return <div className="space-y-5">{renderedBlocks}</div>;
}

function headingTag(level?: number): { Tag: React.ElementType; className: string } {
  if (level === 3) return { Tag: 'h3', className: 'text-xl font-bold text-gray-800 mt-6 mb-3' };
  if (level && level >= 4) return { Tag: 'h4', className: 'text-lg font-semibold text-gray-800 mt-5 mb-2' };
  return { Tag: 'h2', className: 'text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-100' };
}

function RenderSingleBlock({ block }: { block: Block }) {
  if (block.type === 'paragraph') {
    return <p className="text-gray-700 leading-relaxed text-[15px]">{block.text}</p>;
  }
  if (block.type === 'heading') {
    const { Tag, className } = headingTag(block.level);
    return <Tag className={className}>{block.text}</Tag>;
  }
  if (block.type === 'image') {
    return (
      <figure className="my-6">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden shadow-sm bg-gray-100">
          <Image
            src={block.url || '/images/packages/kashmir.webp'}
            alt={block.alt || 'Package Image'}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
        </div>
        {block.caption && (
          <figcaption className="mt-2 text-xs text-gray-500 text-center">{block.caption}</figcaption>
        )}
      </figure>
    );
  }
  if (block.type === 'list') {
    const items = (block.items || []).filter(Boolean);
    if (items.length === 0) return null;
    const ListTag = block.ordered ? 'ol' : 'ul';
    return (
      <ListTag className={block.ordered ? 'list-decimal pl-6 space-y-2 text-gray-700 leading-relaxed text-[15px]' : 'list-disc pl-6 space-y-2 text-gray-700 leading-relaxed text-[15px]'}>
        {items.map((item, idx) => (
          <li key={idx} className="pl-1">{item}</li>
        ))}
      </ListTag>
    );
  }
  if (block.type === 'table') {
    const rows = block.rows || [];
    if (rows.length === 0) return null;
    // Only treat the first row as a header when every cell is short (a real
    // column header). Key-value tables like ['Tour Name', 'Char Dham Yatra...']
    // must render as normal rows instead.
    const firstRowIsHeader = rows[0].length > 1 && rows[0].every((c) => c.length < 30);
    const bodyRows = firstRowIsHeader ? rows.slice(1) : rows;
    return (
      <div className="overflow-x-auto my-6 rounded-lg border border-gray-200">
        <table className="min-w-full text-left text-sm">
          {firstRowIsHeader && (
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {rows[0].map((cell, cIdx) => (
                  <th key={cIdx} className="px-4 py-3 font-bold text-gray-800 border-r last:border-r-0 border-gray-200">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-200">
            {bodyRows.map((row, rIdx) => (
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
  return null;
}

function DayAccordionItem({ title, blocks }: { title: string, blocks: Block[] }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white shadow-sm transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-legacy-orange hover:bg-gray-50 group"
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

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}`}>
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
