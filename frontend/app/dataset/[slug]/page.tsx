import React from 'react';
import {notFound} from 'next/navigation';
import {Description, InfoRow, MapPreview, MetadataTable} from '../../../components/PackageInfo';
import Sidebar from '../../../components/Sidebar';
import {DebugOutput} from '../../../components/DebugOutput'

async function getPackage(slug: string) {
    const res = await fetch(`http://localhost:3000/api/3/action/package_show?id=${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.result
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
                                    <a href="#"
                                       className="text-blue-600 text-sm font-medium ml-auto underline">Meer...</a>
                                </div>
                            }
                        />
                    </div>

                    <Description
                        text={result.notes}
                        links={result.infoLinks}
                    />

                    <MapPreview/>

                    <MetadataTable/>

                    <DebugOutput obj={result}/>
                </div>
            </div>
            <Sidebar dataset={result} />
        </>
    );
};

export default Package;