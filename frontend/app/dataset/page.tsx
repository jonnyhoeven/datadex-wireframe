import React from 'react';
import {DebugOutput} from '../../components/DebugOutput'
import {Description, InfoRow} from "../../components/PackageInfo";
import SearchBar from '../../components/SearchBar';
import {SearchResultsHeader} from '../../components/SearchResultsHeader';
import Link from 'next/link';

async function getSearchResults(searchString: string | undefined) {
    // If no search string, show all datasets using the Solr match-all query '*:*'
    // Otherwise, append wildcard '*' to each term for prefix matching (e.g. 'wat' -> 'wat*')
    const query = searchString?.trim()
        ? searchString.trim().split(/\s+/).map(term => `${term}*`).join(' ')
        : '*:*';
    
    const params = new URLSearchParams({
        q: query,
        defType: 'edismax',
        qf: 'title^2 name^2 notes^1 tags^1',
        rows: '20'
    });

    const res = await fetch(`http://localhost:3000/api/3/action/package_search?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.result
}

const searchResults = async ({searchParams}: { searchParams: Promise<{ q: string }> }) => {
    const {q} = await searchParams;
    const results = await getSearchResults(q);

    if (!results) {
        return <div className="card">Fout bij het ophalen van resultaten.</div>
    }

    return (
        <div className="lg:w-1/1">
            <SearchBar initialValue={q} className="mb-5" />

            <SearchResultsHeader count={results.count} query={q} />

            {results.results.map((result) => (
                <div key={result.id} className="card">
                    <h2 className="text-2xl font-bold mb-6"><Link href={'/dataset/'+ result.name}>{result.title}</Link></h2>
                    <div className="space-y-4 mb-8">
                        <InfoRow label="Type" value={result.type}/>
                        <InfoRow label="Bron" value={result.organization?.title}/>
                        <InfoRow label="Classificatie" value={result.private ? 'Prive' : 'Openbaar'}/>
                        <InfoRow label="Licentie" value={result.license_title}/>
                        <InfoRow
                            label="Thema's"
                            border={false}
                            value={
                                <div className="flex flex-wrap gap-2">
                                    {result.tags?.map((tag) => (
                                        <span key={tag.name} className="tag">
                                            {tag.display_name}
                                        </span>
                                    ))}
                                </div>
                            }
                        />
                    </div>

                    <Description
                        text={result.notes}
                        links={result.resources?.map((r: any) => ({ label: r.name, url: r.url }))}
                    />
                </div>
            ))}

            <DebugOutput obj={results}/>
        </div>
    );
};

export default searchResults;
