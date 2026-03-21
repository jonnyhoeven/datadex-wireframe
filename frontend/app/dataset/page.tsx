import React from 'react';
import {DebugOutput} from '../../components/DebugOutput'


async function getSearchResults(searchString: string) {
    const res = await fetch(`http://localhost:3000/api/3/action/package_search?q=${searchString}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.result
}

const searchResults = async ({searchParams}: { searchParams: Promise<{ q: string }> }) => {
    const {q} = await searchParams;
    const query = await getSearchResults(q);
    return (
        <div className="lg:w-1/1">
            <div className="card">
                <h4 className="text-2xl font-bold mb-6">
                    {query.count === 1 ? '1 resultaat' : query.count === 0 ? 'Geen resultaten' : query.count + ' resultaten'} gevonden voor: <i>{q}</i>
                </h4>
            </div>


            <div className="space-y-4 mb-8">

            </div>

            <DebugOutput obj={query}/>

        </div>
    );
};

export default searchResults;
