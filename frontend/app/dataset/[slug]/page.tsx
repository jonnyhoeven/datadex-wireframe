import React from 'react';
import {notFound} from 'next/navigation';
import {InfoRow, MetadataTable} from '../../../components/PackageInfo';
import ResourceHealth from '../../../components/ResourceHealth';
import MapWrapper from '../../../components/MapWrapper';
import Sidebar from '../../../components/Sidebar';
import {DebugOutput} from '../../../components/DebugOutput'
import Link from "next/link";
import { fetchCKAN } from '../../../lib/ckan';
import { Dataset } from '../../../types/ckan';
import { Metadata } from 'next';

async function getPackage(slug: string) {
    return fetchCKAN<Dataset>('package_show', { id: slug });
}

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const {slug} = await params;
    const result = await getPackage(slug);

    if (!result) return { title: 'Dataset niet gevonden' };

    return {
        title: `${result.title} - Data4OOV Catalogus`,
        description: result.notes?.slice(0, 160),
    };
}

const Package = async ({params}: { params: Promise<{ slug: string }> }) => {
    const {slug} = await params;
    const result = await getPackage(slug);

    if (!result) {
        notFound();
    }

    return (
        <>
            <div className="lg:w-2/3">
                <div className="card">
                    <h2 className="text-2xl font-bold mb-6">{result.title}</h2>
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
                                                {tag.display_name}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            }
                        />
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold mb-2">Beschrijving</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {result.notes || ''}
                        </p>
                        <h3 className="font-bold text-sm mb-2">Datasets:</h3>
                        <ul className="text-xs space-y-2 text-gray-500">
                            {result.resources ? result.resources.map((resource, index) => (
                                <li key={index} className="flex flex-wrap items-center">
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1 break-all">
                                        {resource.name}
                                    </a>
                                    {resource.id && (
                                        <React.Suspense fallback={<span className="ml-2 text-[10px] text-gray-400">Status laden...</span>}>
                                            <ResourceHealth resourceId={resource.id} />
                                        </React.Suspense>
                                    )}
                                </li>
                            )) : null}
                        </ul>
                    </div>

                    <div>
                        <div className="relative w-full z-0">
                            <MapWrapper links={result.resources?.map(r => ({ label: r.name, url: r.url, id: r.id, format: r.format })) || []}/>
                        </div>
                    </div>


                    <MetadataTable extras={result.extras}/>

                    {process.env.NODE_ENV === 'development' && <DebugOutput obj={result}/>}
                </div>
            </div>
            <Sidebar dataset={result} />
        </>
    );
};

export default Package;