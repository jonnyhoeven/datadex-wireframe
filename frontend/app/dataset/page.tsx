import React from 'react';
import {DebugOutput} from '../../components/DebugOutput'
import SearchBar from '../../components/SearchBar';
import {SearchResultsHeader} from '../../components/SearchResultsHeader';
import {fetchCKAN} from '../../lib/ckan';
import {SearchResult} from '../../types/ckan';
import {DatasetCard} from '../../components/DatasetCard';
import {Metadata} from 'next';

async function getSearchResults(searchString: string | undefined) {
    // If no search string, show all datasets using the Solr match-all query '*:*'
    // Otherwise, append wildcard '*' to each term for prefix matching (e.g. 'wat' -> 'wat*')
    const query = searchString?.trim()
        ? searchString.trim().split(/\s+/).map(term => `${term}*`).join(' ')
        : '*:*';

    const params = {
        q: query,
        defType: 'edismax',
        qf: 'title^2 name^2 notes^1 tags^1',
        rows: '20'
    };

    return fetchCKAN<SearchResult>('package_search', params);
}

export async function generateMetadata({searchParams}: { searchParams: Promise<{ q: string }> }): Promise<Metadata> {
    const {q} = await searchParams;
    return {
        title: q ? `Zoekresultaten voor "${q}" - Data4OOV Catalogus` : 'Datasets - Data4OOV Catalogus',
    };
}

const SearchResults = async ({searchParams}: { searchParams: Promise<{ q: string }> }) => {
    const {q} = await searchParams;
    const results = await getSearchResults(q);

    if (!results) {
        return <div className="card">Fout bij het ophalen van resultaten.</div>
    }

    return (
        <div className="lg:w-1/1 w-full">
            <SearchBar initialValue={q} className="mb-5"/>

            <SearchResultsHeader count={results.count} query={q}/>

            {results.results.map((result) => (
                <DatasetCard key={result.id} dataset={result}/>
            ))}

            {process.env.NODE_ENV === 'development' && <DebugOutput obj={results}/>}
        </div>
    );
};

export default SearchResults;
