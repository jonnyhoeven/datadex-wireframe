import React from 'react';
import { fetchCKAN } from '../../lib/ckan';
import { Dataset, LinkReport } from '../../types/ckan';
import Link from 'next/link';
import { CheckCircle, AlertCircle, HelpCircle, ExternalLink } from 'lucide-react';

async function getResourceReport(resourceId: string): Promise<LinkReport | null> {
    return fetchCKAN<LinkReport>('check_link_report_show', { resource_id: resourceId }, { ignoreErrors: true });
}

const StatusPage = async () => {
    // Fetch all datasets with resources
    const datasets = await fetchCKAN<Dataset[]>('current_package_list_with_resources', { limit: '1000' });

    if (!datasets) {
        return (
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-8 text-brand-blue">Systeem Status</h1>
                <p className="text-red-600">Fout bij het ophalen van datasets.</p>
            </div>
        );
    }

    // Prepare status data
    const statusData = await Promise.all(
        datasets.map(async (dataset) => {
            const resources = dataset.resources || [];
            const resourceReports = await Promise.all(
                resources.map(async (res) => {
                    const report = await getResourceReport(res.id);
                    return {
                        resource: res,
                        report: report
                    };
                })
            );

            const allAvailable = resourceReports.length > 0 && resourceReports.every(r => r.report?.is_available);
            const anyUnavailable = resourceReports.some(r => r.report && !r.report.is_available);
            
            let overallStatus = 'unknown';
            if (resourceReports.length > 0) {
                if (anyUnavailable) overallStatus = 'error';
                else if (allAvailable) overallStatus = 'ok';
            }

            return {
                dataset,
                resourceReports,
                overallStatus
            };
        })
    );

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-blue mb-2">Dataset Status Overzicht</h1>
                <p className="text-gray-600">
                    Onderstaand overzicht toont de actuele status van alle datasets en de bijbehorende resources op basis van de automatische link-check.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Dataset</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Organisatie</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Resources & Status</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-sm">Laatste Check</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {statusData.map(({ dataset, resourceReports, overallStatus }) => (
                            <tr key={dataset.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 align-top">
                                    <Link href={`/dataset/${dataset.name}`} className="font-semibold text-brand-blue hover:underline block">
                                        {dataset.title || dataset.name}
                                    </Link>
                                    <div className="text-[10px] text-gray-400 mt-1 uppercase">ID: {dataset.id.substring(0, 8)}...</div>
                                </td>
                                <td className="px-6 py-4 align-top">
                                    <span className="text-sm text-gray-600">{dataset.organization?.title || 'Geen organisatie'}</span>
                                </td>
                                <td className="px-6 py-4 align-top">
                                    <div className="space-y-3">
                                        {resourceReports.length === 0 ? (
                                            <span className="text-xs text-gray-400 italic">Geen resources beschikbaar</span>
                                        ) : (
                                            resourceReports.map(({ resource, report }, idx) => (
                                                <div key={resource.id} className="flex items-start gap-3">
                                                    <div className="mt-1">
                                                        {report ? (
                                                            report.is_available ? (
                                                                <CheckCircle className="text-green-500 w-4 h-4"/>
                                                            ) : (
                                                                <AlertCircle className="text-red-500 w-4 h-4"/>
                                                            )
                                                        ) : (
                                                            <HelpCircle className="text-gray-300 w-4 h-4"/>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
                                                            {resource.name || 'Naamloze resource'}
                                                            <span className="text-[10px] bg-gray-100 px-1 rounded uppercase">{resource.format}</span>
                                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 ml-1">
                                                                <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        </div>
                                                        {report && !report.is_available && (
                                                            <div className="text-[10px] text-red-500 mt-0.5">
                                                                {report.status}: {report.message || 'Geen foutmelding'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 align-top">
                                    <div className="text-xs text-gray-500">
                                        {(() => {
                                            const times = resourceReports
                                                .map(r => r.report?.last_check ? new Date(r.report.last_check).getTime() : 0)
                                                .filter(t => t > 0);
                                            return times.length > 0 
                                                ? new Date(Math.max(...times)).toLocaleString('nl-NL')
                                                : 'Nooit gecontroleerd';
                                        })()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="text-green-600 w-5 h-5" />
                        <h3 className="font-bold text-green-900">Operationeel</h3>
                    </div>
                    <p className="text-sm text-green-700">
                        Datasets die volledig beschikbaar zijn en geen foutmeldingen geven bij de laatste check.
                    </p>
                </div>
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="text-red-600 w-5 h-5" />
                        <h3 className="font-bold text-red-900">Aandacht Vereist</h3>
                    </div>
                    <p className="text-sm text-red-700">
                        Eén of meer links in deze dataset zijn onbereikbaar of geven een foutcode (bijv. 404 of 500).
                    </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <HelpCircle className="text-gray-400 w-5 h-5" />
                        <h3 className="font-bold text-gray-900">Onbekend</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        De status van deze dataset is nog niet gecontroleerd door de automatische checker.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
