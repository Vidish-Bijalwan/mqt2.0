"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import destinationsDataRaw from '@/data/destinationsData.json';
import packageDetailsRaw from '@/data/packageDetails.json';

const destinationsData = destinationsDataRaw as Record<string, any>;
const packageDetails = packageDetailsRaw as Record<string, any>;

// Cache the keyword map so we don't build it on every render
let keywordMap: { keyword: string; url: string; regex: RegExp; priority: number }[] | null = null;

function buildKeywordMap() {
  if (keywordMap) return keywordMap;

  const map: { keyword: string; url: string; priority: number }[] = [];

  // Add destinations (high priority for pure names)
  Object.keys(destinationsData).forEach((slug) => {
    // Replace hyphens with spaces
    const name = slug.replace(/-/g, ' ');
    if (name.length > 3) {
      map.push({ keyword: name.toLowerCase(), url: `/destinations/${slug}`, priority: 2 });
    }
  });

  // Add packages (higher priority for full package names to avoid partial matching)
  Object.keys(packageDetails).forEach((slug) => {
    const name = slug.replace(/-/g, ' ').replace(/ tour packages?/gi, '').replace(/ package/gi, '').trim();
    if (name.length > 4) {
      // If it contains "tour", link to package
      map.push({ keyword: `${name.toLowerCase()} tour`, url: `/packages/${slug}`, priority: 3 });
      map.push({ keyword: `${name.toLowerCase()} package`, url: `/packages/${slug}`, priority: 3 });
      // If we don't have a destination for this name, add it as a package link with lower priority
      if (!map.some(m => m.keyword === name.toLowerCase() && m.priority === 2)) {
        map.push({ keyword: name.toLowerCase(), url: `/packages/${slug}`, priority: 1 });
      }
    }
  });

  // Sort by length descending (longest keywords match first)
  map.sort((a, b) => b.keyword.length - a.keyword.length);

  keywordMap = map.map(item => ({
    ...item,
    // Word boundary regex, case insensitive
    regex: new RegExp(`\\b(${item.keyword})\\b`, 'i'),
  }));

  return keywordMap;
}

interface AutoLinkerProps {
  text: string;
  className?: string;
  maxLinks?: number; // Limit number of links per paragraph to avoid spammy look
}

export default function AutoLinker({ text, className = '', maxLinks = 4 }: AutoLinkerProps) {
  const map = useMemo(() => buildKeywordMap(), []);

  const elements = useMemo(() => {
    let result: (string | React.ReactNode)[] = [text];
    let linksAdded = 0;

    for (const { keyword, url, regex } of map) {
      if (linksAdded >= maxLinks) break;

      const newResult: (string | React.ReactNode)[] = [];
      let replacedInThisPass = false;

      for (const item of result) {
        if (typeof item === 'string' && !replacedInThisPass) {
          const match = item.match(regex);
          if (match && match.index !== undefined) {
            const matchedText = match[0];
            const before = item.substring(0, match.index);
            const after = item.substring(match.index + matchedText.length);
            
            if (before) newResult.push(before);
            newResult.push(
              <Link 
                key={`${url}-${linksAdded}`} 
                href={url} 
                className={`text-brand-blue font-medium hover:underline ${className}`}
                title={`Explore ${matchedText}`}
              >
                {matchedText}
              </Link>
            );
            if (after) newResult.push(after);
            
            linksAdded++;
            replacedInThisPass = true;
          } else {
            newResult.push(item);
          }
        } else {
          newResult.push(item);
        }
      }
      result = newResult;
    }

    return result;
  }, [text, map, maxLinks, className]);

  return <>{elements.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>)}</>;
}
