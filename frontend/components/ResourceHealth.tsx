import React from 'react';
import { fetchCKAN } from '../lib/ckan';
import { LinkReport } from '../types/ckan';

interface ResourceHealthProps {
    resourceId: string;
}

const ResourceHealth = async ({ resourceId }: ResourceHealthProps) => {
    // Note: ckanext-check-link API returns report for a resource_id
    const report = await fetchCKAN<LinkReport>('check_link_report_show', { resource_id: resourceId }, { ignoreErrors: true });

    if (!report) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 ml-2">
                Status onbekend
            </span>
        );
    }

    const isAvailable = report.is_available;
    const statusText = isAvailable ? 'Beschikbaar' : 'Onbereikbaar';
    const bgColor = isAvailable ? 'bg-green-100' : 'bg-red-100';
    const textColor = isAvailable ? 'bg-green-100' : 'bg-red-100'; // Actually text color classes:
    const dotColor = isAvailable ? 'bg-green-400' : 'bg-red-400';

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} ml-2`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor} mr-1.5`}></span>
            {statusText} {report.status && `(${report.status})`}
        </span>
    );
};

export default ResourceHealth;
