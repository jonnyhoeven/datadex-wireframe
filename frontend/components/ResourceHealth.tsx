import React from 'react';
import { fetchCKAN } from '../lib/ckan';
import { LinkReport, LinkReportSearchResult } from '../types/ckan';

interface ResourceHealthProps {
    resourceId: string;
}

const ResourceHealth = async ({ resourceId }: ResourceHealthProps) => {
    // Note: ckanext-check-link API returns report for a resource_id
    const response = await fetchCKAN<LinkReportSearchResult>('check_link_report_search', { resource_id: resourceId }, { ignoreErrors: true, method: 'POST' });
    const report = response?.results?.[0] || null;

    if (!report) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 ml-2">
                Status onbekend
            </span>
        );
    }

    const isUp = report.state === 'up';
    const statusText = isUp ? 'Beschikbaar' : (report.state === 'pending' ? 'In afwachting' : 'Fout');
    const bgColor = isUp ? 'bg-green-100' : (report.state === 'pending' ? 'bg-gray-100' : 'bg-red-100');
    const textColor = isUp ? 'text-green-800' : (report.state === 'pending' ? 'text-gray-800' : 'text-red-800');
    const dotColor = isUp ? 'bg-green-400' : (report.state === 'pending' ? 'bg-gray-400' : 'bg-red-400');

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${bgColor} ${textColor} ml-2`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor} mr-1.5`}></span>
            {statusText} {report.details?.code && `(${report.details.code})`}
        </span>
    );
};

export default ResourceHealth;
