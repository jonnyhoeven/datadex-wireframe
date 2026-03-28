import React from 'react';
import {DebugOutput} from '../../components/DebugOutput'
import SearchBar from '../../components/SearchBar';
import {SearchResultsHeader} from '../../components/SearchResultsHeader';
import { fetchCKAN } from '../../lib/ckan';
import { SearchResult } from '../../types/ckan';
import { Metadata } from 'next';
import Link from 'next/link';

async function getTags(searchString: string | undefined) {
    const params: Record<string, string> = {
        'facet.field': '["tags"]',
        'facet.limit': '-1', // Get all tags
        'rows': '0'
    };

    // Note: facet.prefix is not exactly the same as full text search but works well for tag index filtering
    if (searchString) {
        params['facet.prefix'] = searchString.toLowerCase();
    }

    const result = await fetchCKAN<SearchResult>('package_search', params);
    
    // Sort tags by count descending
    const tags = result?.search_facets?.tags?.items || [];
    return tags.sort((a: any, b: any) => b.count - a.count);
}

export const metadata: Metadata = {
    title: 'Thema\'s - Data4OOV Catalogus',
};

const TagIndex = async ({searchParams}: { searchParams: Promise<{ q: string }> }) => {
    const {q} = await searchParams;
    const tags = await getTags(q);

    return (
        <div className="lg:w-1/1 w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Thema's</h1>
                <p className="text-gray-600 mb-6">
                    Ontdek datasets via verschillende thema's en categorieën binnen de Data4OOV catalogus.
                </p>
                <SearchBar 
                    initialValue={q} 
                    placeholder="Filter thema's..." 
                    className="mb-5" 
                    basePath="/tag"
                />
            </div>

            <SearchResultsHeader count={tags.length} query={q} />

            {tags.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {tags.map((tag: any) => (
                        <Link 
                            key={tag.name} 
                            href={`/tag/${encodeURIComponent(tag.name)}`}
                            className="group"
                        >
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all h-full flex flex-col justify-between">
                                <div className="font-bold text-[#004562] group-hover:text-blue-700 transition-colors break-words">
                                    {tag.display_name}
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    {tag.count} {tag.count === 1 ? 'dataset' : 'datasets'}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="card mt-6 py-12 text-center text-gray-500 italic">
                    Geen thema's gevonden die voldoen aan uw zoekopdracht.
                </div>
            )}

            {process.env.NODE_ENV === 'development' && <DebugOutput obj={tags}/>}
        </div>
    );
};

export default TagIndex;
