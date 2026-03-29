import React from 'react';
import {notFound} from 'next/navigation';
import {Description, InfoRow, MapPreview, MetadataTable} from '../../../components/PackageInfo';
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

                    <Description
                        text={result.notes || ''}
                        links={result.resources?.map(r => ({ label: r.name, url: r.url, id: r.id })) || []}
                    />

                    <div className="rounded-xl overflow-hidden border border-gray-200 mb-8 bg-gray-50">
                        <div className="relative h-64 md:h-80 w-full z-0">
                            <MapWrapper links={result.resources?.map(r => ({ label: r.name, url: r.url, id: r.id })) || []}/>
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