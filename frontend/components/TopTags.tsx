import React from 'react';
import Link from 'next/link';

async function getTopTags() {
    const params = new URLSearchParams({
        'facet.field': '["tags"]',
        'facet.limit': '10',
        'rows': '0'
    });

    try {
        const res = await fetch(`http://localhost:3000/api/3/action/package_search?${params.toString()}`, {
            next: { revalidate: 3600 } // Cache results for 1 hour
        });
        
        if (!res.ok) {
            console.error('Failed to fetch tags:', res.statusText);
            return [];
        }
        
        const data = await res.json();
        return data.result?.search_facets?.tags?.items || [];
    } catch (error) {
        console.error('Error fetching top tags:', error);
        return [];
    }
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
                    href={`/tag?q=${encodeURIComponent(tag.display_name)}`}
                    className="tag hover:bg-gray-200 transition-colors text-[#004562] border border-gray-100"
                >
                    {tag.display_name} <span className="text-xs text-gray-400 font-normal ml-1">({tag.count})</span>
                </Link>
            ))}
        </div>
    );
};

export default TopTags;
