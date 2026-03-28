import React from 'react';
import Link from 'next/link';
import { fetchCKAN } from '../lib/ckan';
import { Dataset } from '../types/ckan';
import DatasetHealthSummary from './DatasetHealthSummary';
import TopTags from "./TopTags";

const LatestDatasets = async () => {
    const datasets = await fetchCKAN<Dataset[]>('current_package_list_with_resources', { limit: '5' });

    if (!datasets || datasets.length === 0) {
        return null;
    }

    return (
        <div className="text-[#004562] p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-3">Nieuw</h2>
            <div className="space-y-4">
                {datasets.map((dataset) => (
                    <div key={dataset.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <Link href={`/dataset/${dataset.name}`} className="block group">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-semibold text-gray-900 group-hover:text-[#004562] transition-colors line-clamp-1 text-sm">
                                    {dataset.title || dataset.name}
                                </h3>
                                <React.Suspense fallback={<div className="h-2 w-2 rounded-full bg-gray-100 animate-pulse"></div>}>
                                    <DatasetHealthSummary resourceIds={dataset.resources?.map(r => r.id) || []} />
                                </React.Suspense>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-[10px] text-gray-500 uppercase tracking-tight">
                                    {dataset.organization?.title || 'Geen organisatie'}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    {dataset.metadata_modified 
                                        ? new Date(dataset.metadata_modified).toLocaleString('nl-NL', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) 
                                        : 'Onbekend'}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <Link href="/dataset" className="text-[#004562] font-semibold hover:underline flex items-center gap-1 text-sm">
                    Bekijk alle datasets
                    <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>
        </div>
    );
};

export default LatestDatasets;
