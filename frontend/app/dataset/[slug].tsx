'use client'
import React from 'react';
import {Description, InfoRow, MapPreview, MetadataTable} from '../../components/DatasetInfo';
import Sidebar from '../../components/Sidebar';
import { useRouter } from 'next/navigation'

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

const Dataset = () => {
    return (
        <>
            <div className="lg:w-2/3">
                <div className="card">
                    <h2 className="text-2xl font-bold mb-6">{datasetData.title}</h2>

                    <div className="space-y-4 mb-8">
                        <InfoRow label="Type" value={datasetData.type} />
                        <InfoRow label="Bron" value={datasetData.source} />
                        <InfoRow label="Classificatie" value={datasetData.classification} />
                        <InfoRow label="Licentie" value={datasetData.license} />
                        <InfoRow
                            label="Thema's"
                            border={false}
                            value={
                                <div className="flex flex-wrap gap-2">
                                    {datasetData.themes.map((theme, index) => (
                                        <span key={index} className="tag">
                                            {theme.label}: {theme.value}
                                        </span>
                                    ))}
                                    <a href="#" className="text-blue-600 text-sm font-medium ml-auto underline">Meer...</a>
                                </div>
                            }
                        />
                    </div>

                    <Description
                        text={datasetData.description}
                        links={datasetData.infoLinks}
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
