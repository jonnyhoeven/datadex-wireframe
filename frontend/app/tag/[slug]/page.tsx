import React from 'react';
import {DebugOutput} from '../../../components/DebugOutput'
import {notFound} from "next/navigation";
import {SearchResultsHeader} from '../../../components/SearchResultsHeader';
import { fetchCKAN } from '../../../lib/ckan';
import { SearchResult } from '../../../types/ckan';
import { DatasetCard } from '../../../components/DatasetCard';
import { Metadata } from 'next';

async function getTagResults(slug: string | undefined) {
  if (!slug) return null;
  return fetchCKAN<SearchResult>('package_search', { fq: `tags:${slug.trim()}` });
}

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const {slug} = await params;
    const decodedSlug = decodeURIComponent(slug);
    return {
        title: `Thema: ${decodedSlug} - Data4OOV`,
    };
}

const TagResults = async ({params}: { params: Promise<{ slug: string }> }) => {
    const {slug} = await params;
    const decodedSlug = decodeURIComponent(slug);
    const results = await getTagResults(decodedSlug);

    if (!results) {
        notFound();
    }

  return (
      <div className="lg:w-1/1 w-full">
        <SearchResultsHeader count={results.count} query={decodedSlug} />

        {results.results.map((result) => (
            <DatasetCard key={result.id} dataset={result} />
        ))}

        {process.env.NODE_ENV === 'development' && <DebugOutput obj={results}/>}
      </div>
  );
};

export default TagResults;
