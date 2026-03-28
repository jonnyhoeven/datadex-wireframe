import React from 'react';
import Link from 'next/link';
import { fetchCKAN } from '../lib/ckan';
import { SearchResult } from '../types/ckan';

async function getTopTags() {
    const params = {
        'facet.field': '["tags"]',
        'facet.limit': '35',
        'rows': '0'
    };

    const result = await fetchCKAN<SearchResult>('package_search', params, {
        next: { revalidate: 3600 } // Cache results for 1 hour
    });
    
    return result?.search_facets?.tags?.items || [];
}

const TopTags = async () => {
    const tags = await getTopTags();

    if (!tags || tags.length === 0) {
        return (
            <div className="text-gray-500 italic text-sm py-4">
                Geen thema's gevonden.
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2 py-2">
            {tags.map((tag: any) => (
                <Link 
                    key={tag.name} 
                    href={`/tag/${encodeURIComponent(tag.name)}`}
                >
                    <div className="tag hover:bg-gray-200 transition-colors text-[#004562] border border-gray-100">
                    {tag.display_name} <span className="text-xs text-gray-400 font-normal ml-1">({tag.count})</span>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default TopTags;
