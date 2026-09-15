"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import ExpandableText from '@/components/ui/ExpandableText';
import type { Block, FaqItem } from '@/utils/blocks';
import { IMAGE_SKELETON } from '@/utils/imagePlaceholder';

interface BlockRendererProps {
  blocks: Block[];
  /** Truncate long paragraphs with a See More toggle (used in the Overview tab). */
  truncate?: boolean;
}

function cleanBlockText(value: string) {
  return String(value || '')
    .replace(/Places You[’']ll See/gi, '')
    .replace(/\bSee More\b|\bSee Less\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function BlockRenderer({ blocks, truncate = false }: BlockRendererProps) {
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
          key={`accordion-${accordionIndex}`}
          title={currentAccordionTitle}
          blocks={currentAccordion}
          index={accordionIndex}
        />
      );
      accordionIndex++;
      currentAccordion = [];
      currentAccordionTitle = "";
    }
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    const blockText = block.text || block.content || '';
    if (block.type === 'heading' && blockText.match(/^(Day\s*\d+|Day\s*-\s*\d+)/i)) {
      flushAccordion();
      currentAccordionTitle = blockText;
    } else if (block.type === 'heading' && currentAccordion.length > 0 && !blockText.match(/^(Day\s*\d+|Day\s*-\s*\d+)/i)) {
      flushAccordion();
      renderedBlocks.push(<RenderSingleBlock key={`block-${i}`} block={block} truncate={truncate} />);
    } else if (currentAccordionTitle) {
      currentAccordion.push(block);
    } else {
      renderedBlocks.push(<RenderSingleBlock key={`block-${i}`} block={block} truncate={truncate} />);
    }
  }

  flushAccordion();

  if (renderedBlocks.length === 0) {
    return <p className="text-gray-500 italic">Detailed itinerary is not available for this package.</p>;
  }

  return <div className="space-y-5">{renderedBlocks}</div>;
}

function headingTag(level?: number): { Tag: React.ElementType; className: string } {
  // Normalize scraped levels so the hierarchy never jumps (h1→h2→h3 only):
  // levels 1-2 render as h2, level 3 as h3, anything deeper clamps to h3.
  if (level === 3 || (level && level >= 4)) {
    return { Tag: 'h3', className: 'text-xl font-bold text-gray-800 mt-6 mb-3' };
  }
  return { Tag: 'h2', className: 'text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-100' };
}

function RenderSingleBlock({ block, truncate }: { block: Block; truncate?: boolean }) {
  // Normalize: support both "text" (legacy) and "content" (enriched) fields
  const txt = cleanBlockText(block.text || block.content || '');
  if (block.type === 'paragraph') {
    if (truncate && txt && txt.length > 280) {
      return <ExpandableText text={txt} className="text-gray-700 leading-relaxed text-[15px]" />;
    }
    return <p className="text-gray-700 leading-relaxed text-[15px]">{txt}</p>;
  }
  if (block.type === 'heading') {
    const { Tag, className } = headingTag(block.level);
    return <Tag className={className}>{txt}</Tag>;
  }
  if (block.type === 'faq') {
    const items = (block.items || []).filter((item): item is FaqItem => typeof item !== 'string');
    if (items.length === 0) return null;
    return (
      <div className="space-y-3 my-6">
        {items.map((item, idx) => (
          <details key={idx} className="group border border-gray-200 rounded-lg overflow-hidden">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-50 hover:bg-gray-100 font-semibold text-gray-800 text-[15px]">
              {item.q}
              <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-4 py-3 text-gray-700 text-[15px] leading-relaxed border-t border-gray-100">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    );
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
            loading="lazy"
            decoding="async"
            placeholder={IMAGE_SKELETON}
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
    // Drop scraped "See More"/"See Less" toggle artifacts.
    const items = (block.items || [])
      .filter((item): item is string => typeof item === 'string')
      .map((s) => (s || '').trim())
      .filter(Boolean)
      .filter((s) => !/^see (more|less)$/i.test(s));
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

function DayAccordionItem({ title, blocks, index }: { title: string, blocks: Block[], index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const contentId = `block-itinerary-day-${index}`;
  const cleanTitle = cleanBlockText(title).replace(/^day\s*\d+\s*[:.-]?\s*/i, '').trim() || title;

  return (
    <div className={`relative mb-4 overflow-hidden rounded-2xl border bg-white transition ${isOpen ? 'border-[#9fc6bb] shadow-[0_12px_30px_rgba(11,48,44,0.08)]' : 'border-[#dfe9e6] hover:border-[#b7d2ca]'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="group flex min-h-[78px] w-full items-center justify-between p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#28796b] md:p-5"
      >
        <div className="flex min-w-0 items-center space-x-3 md:space-x-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-white text-sm font-black shadow-sm ${isOpen ? 'bg-[#0b5147] text-white' : 'bg-[#eaf3f0] text-[#18594d]'}`}>
            {index + 1}
          </div>
          <div className="min-w-0">
            <span className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#b65d25]">Day {index + 1}</span>
            <h3 className="text-base font-extrabold leading-snug text-[#193b35] md:text-lg">{cleanTitle}</h3>
          </div>
        </div>
        <ChevronDown className={`ml-3 h-5 w-5 shrink-0 text-[#52716a] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div id={contentId} hidden={!isOpen}>
        <div className="border-t border-[#e0ebe8] bg-[#f6faf9] p-5 sm:pl-20 md:p-6 md:pl-20">
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
