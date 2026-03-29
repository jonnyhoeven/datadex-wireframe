import React from 'react';
import {DebugOutput} from '../../components/DebugOutput'
import { fetchCKAN } from '../../lib/ckan';
import { SearchResult } from '../../types/ckan';
import { Metadata } from 'next';
import Link from 'next/link';

async function getAllTags() {
    const params: Record<string, string> = {
        'facet.field': '["tags"]',
        'facet.limit': '-1', // Get all tags
        'rows': '0'
    };

    const result = await fetchCKAN<SearchResult>('package_search', params, {
        next: { revalidate: 3600 } // Cache results for 1 hour
    });
    
    // Sort tags by count descending
    const tags = result?.search_facets?.tags?.items || [];
    return tags.sort((a: any, b: any) => b.count - a.count);
}

export const metadata: Metadata = {
    title: 'Alle Thema\'s - Data4OOV',
};

const TagIndex = async () => {
    const tags = await getAllTags();

    return (
        <div className="lg:w-1/1 w-full">
            <div className="mb-8 pb-6">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Thema's</h1>
                <p className="text-xl text-gray-600">
                    Blader door de volledige lijst met thema's binnen de Data4OOV catalogus.
                </p>
            </div>


            {tags.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                    {tags.map((tag: any) => (
                        <Link 
                            key={tag.name} 
                            href={`/tag/${encodeURIComponent(tag.name)}`}
                            className="group"
                        >
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all h-full flex flex-col justify-between">
                                <div className="font-bold text-lg text-[#004562] group-hover:text-blue-700 transition-colors break-words">
                                    {tag.display_name}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        {tag.count} {tag.count === 1 ? 'dataset' : 'datasets'}
                                    </span>
                                    <span className="text-[#004562] opacity-0 group-hover:opacity-100 transition-opacity">
                                        &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="card mt-6 py-12 text-center text-gray-500 italic">
                    Geen thema's gevonden.
                </div>
            )}

            {process.env.NODE_ENV === 'development' && <DebugOutput obj={tags}/>}
        </div>
    );
};

export default TagIndex;
