import React from 'react';
import {DebugOutput} from '../../../components/DebugOutput'
import {Description, InfoRow} from "../../../components/PackageInfo";
import Link from 'next/link';
import {notFound} from "next/navigation";
import {SearchResultsHeader} from '../../../components/SearchResultsHeader';

async function getTag(slug: string | undefined) {
  const res = await fetch(`http://localhost:3000/api/3/action/package_search?fq=tags:${slug?.trim()}`);
  console.log(slug + 'djwiokidjwi')
  if (!res.ok) return null;
  const data = await res.json();
  return data.result
}

const searchResults = async ({params}: { params: Promise<{ slug: string }> }) => {
    const {slug} = await params;
    const results = await getTag(slug);
    if (!results) {
        notFound();
    }

  if (!results) {
    return <div className="lg:w-1/1 card">Fout bij het ophalen van resultaten.</div>
  }

  return (
      <div className="lg:w-1/1">

        <SearchResultsHeader count={results.count} query={slug?.trim()} />

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
                              <Link
                                  key={tag.name}
                                  href={`/tag/${encodeURIComponent(tag.display_name)}`}
                              >
                                  <div className="tag hover:bg-gray-200 transition-colors text-[#004562] border border-gray-100">
                                      {tag.display_name} <span className="text-xs text-gray-400 font-normal ml-1"></span>
                                  </div>
                              </Link>
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
