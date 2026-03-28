'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Maps URL segments to human-readable labels.
 */
const labelMap: Record<string, string> = {
  'dataset': 'Datasets',
  'tag': 'Thema\'s',
  'api': 'API Tester',
  'gebruik': 'Gebruiksvoorwaarden',
  'status': 'Systeem Status',
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on the home page
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex overflow-x-auto whitespace-nowrap py-1 text-sm">
      <ol className="flex items-center space-x-2 text-gray-500">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="hover:text-[#004562] transition-colors"
          >
            Home
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          
          // Try to map the segment to a label, otherwise decode and capitalize
          let label = labelMap[segment] || decodeURIComponent(segment);
          
          // Clean up slug-style strings (e.g. "my-dataset" -> "my dataset")
          label = label.replace(/-/g, ' ');

          return (
            <li key={href} className="flex items-center space-x-2">
              <span className="text-gray-400 font-light">/</span>
              {isLast ? (
                <span className="font-semibold text-[#004562] truncate max-w-[200px] sm:max-w-md capitalize">
                  {label}
                </span>
              ) : (
                <Link 
                  href={href} 
                  className="hover:text-[#004562] transition-colors capitalize"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
