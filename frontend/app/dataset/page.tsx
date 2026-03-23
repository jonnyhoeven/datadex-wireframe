import React from 'react';
import {DebugOutput} from '../../components/DebugOutput'
import {Description, InfoRow} from "../../components/PackageInfo";


async function getSearchResults(searchString: string) {
    const res = await fetch(`http://localhost:3000/api/3/action/package_search?q=${searchString}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.result
}

const searchResults = async ({searchParams}: { searchParams: Promise<{ q: string }> }) => {
    const {q} = await searchParams;
    const results = await getSearchResults(q);
    return (
        <div className="lg:w-1/1">

            <div className="relative max-w-2xl mx-auto mb-5">
                <input
                    type="text"
                    placeholder="Doorzoek het CKAN archief (bijv. Water)..."
                    className="w-full rounded-full border border-gray-200 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#004562] focus:border-transparent"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-[#004562] text-white px-6 rounded-full font-medium hover:bg-opacity-90 transition-all">
                    Zoeken
                </button>
            </div>

            <div className="card">
                <h4 className="text-2xl font-bold">
                    {results.count === 1 ? '1 resultaat' : results.count === 0 ? 'Geen resultaten' : results.count + ' resultaten'} gevonden
                    voor: <i>{q}</i>
                </h4>
            </div>

            {results.results.map((result, index) => (
                <div className="card">
                    <h2 className="text-2xl font-bold mb-6">{result.title}</h2>
                    <div className="space-y-4 mb-8">
                        <InfoRow label="Type" value={result.type}/>
                        <InfoRow label="Bron" value={result.organization?.title}/>
                        <InfoRow label="Classificatie" value={result.classification?.private ? 'Prive' : 'Openbaar'}/>
                        <InfoRow label="Licentie" value={result.license_title}/>
                        <InfoRow
                            label="Thema's"
                            border={false}
                            value={
                                <div className="flex flex-wrap gap-2">
                                    {result.tags?.map((tag, index) => (
                                        <span key={index} className="tag">
                                            {tag.display_name}
                                        </span>
                                    ))}
                                </div>
                            }
                        />
                    </div>

                    <Description
                        text={result.notes}
                        links={result.infoLinks}
                    />
                </div>
            ))}

            <DebugOutput obj={results}/>
        </div>
    );
};

export default searchResults;
