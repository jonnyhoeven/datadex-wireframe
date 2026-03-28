import React from 'react';
import { fetchCKAN } from '../lib/ckan';
import { LinkReport } from '../types/ckan';

interface DatasetHealthSummaryProps {
    resourceIds: string[];
}

const DatasetHealthSummary = async ({ resourceIds }: DatasetHealthSummaryProps) => {
    if (!resourceIds || resourceIds.length === 0) return null;

    // Fetch reports for all resources
    const reports = await Promise.all(
        resourceIds.map(id => fetchCKAN<LinkReport>('check_link_report_show', { resource_id: id }, { ignoreErrors: true }))
    );

    const validReports = reports.filter(r => r !== null) as LinkReport[];
    
    if (validReports.length === 0) {
        return <span className="h-2 w-2 rounded-full bg-gray-300" title="Status onbekend"></span>;
    }

    const allAvailable = validReports.every(r => r.is_available);
    const anyUnavailable = validReports.some(r => !r.is_available);

    if (anyUnavailable) {
        return <span className="h-2 w-2 rounded-full bg-red-500" title="Eén of meer links onbereikbaar"></span>;
    }

    if (allAvailable) {
        return <span className="h-2 w-2 rounded-full bg-green-500" title="Alle links beschikbaar"></span>;
    }

    return <span className="h-2 w-2 rounded-full bg-gray-300" title="Status onvolledig"></span>;
};

export default DatasetHealthSummary;
