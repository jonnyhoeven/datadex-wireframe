import React from 'react';
import {notFound} from 'next/navigation';
import {Description, InfoRow, MapPreview, MetadataTable} from '../../../components/DatasetInfo';
import Sidebar from '../../../components/Sidebar';

const datasetData = {
    title: "Risico Index Natuurbranden (RIN)",
    type: "Geo-dataset",
    source: "Geonovation/Nexpri",
    classification: "Openbaar",
    license: "-",
    themes: [
        {label: "Natuurbrandrisico", value: 10},
        {label: "Operationele bedrijfsvoering", value: 6},
        {label: "Infrastructuur drinkwater", value: 4},
    ],
    description: "De Risico Index Natuurbranden werkt met 17 parameters die duiding geven aan de kans op het ontstaan van een onbeheersbare natuurbrand. De opgetelde scores van de parameters bepalen het risico in een gebied per vierkante kilometer. Deze duiding krijgt een 'risicokleur': rood voor een risicovol gedeelte en groen voor weinig risico's bijvoorbeeld. Op basis van de RIN maken betrokken partijen keuzes voor een gebiedsgerichte aanpak. Bijvoorbeeld het plaatsen van een extra bluswatervoorziening.",
    infoLinks: [
        {label: "Informatie", url: "https://nipv.nl/informatievoorziening/voorzieningen/risico-index-natuurbranden/"},
        {label: "Rekenregels", url: "https://www.gitlab.com/nipv/rin/RIN_Rekenregels_v1.3.pdf"},
        {
            label: "Documentatie (pdf)",
            url: "https://nipv.nl/wp-content/uploads/2022/03/202003-BwNL-IFV-Factsheet-Risico-Index-Natuurbranden.pdf"
        },
    ]
};

async function getDataset(slug: string) {
    const res = await fetch(`http://localhost:3000/api/3/action/package_show?id=${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.result
}

const Dataset = async ({params}: { params: Promise<{ slug: string }> }) => {
    const {slug} = await params;
    const dataset = await getDataset(slug);
    if (!dataset) {
        notFound();
    }

    return (
        <>
            <div className="lg:w-2/3">
                <div className="card">
                    <h2 className="text-2xl font-bold mb-6">{dataset.title}</h2>
                    <div className="space-y-4 mb-8">
                        <InfoRow label="Type" value={dataset.type}/>
                        <InfoRow label="Bron" value={dataset.organization?.title}/>
                        <InfoRow label="Classificatie" value={dataset.classification?.private ? 'Prive' : 'Openbaar'}/>
                        <InfoRow label="Licentie" value={dataset.license_title}/>
                        <InfoRow
                            label="Thema's"
                            border={false}
                            value={
                                <div className="flex flex-wrap gap-2">
                                    {dataset.tags?.map((tag, index) => (
                                        <span key={index} className="tag">
                                            {tag.display_name}
                                        </span>
                                    ))}
                                    <a href="#" className="text-blue-600 text-sm font-medium ml-auto underline">Meer...</a>
                                </div>
                            }
                        />
                    </div>

                    <Description
                        text={dataset.notes}
                        links={dataset.infoLinks}
                    />

                    <MapPreview/>

                    <MetadataTable/>
                </div>
            </div>
            <Sidebar/>
        </>
    );
};

export default Dataset;