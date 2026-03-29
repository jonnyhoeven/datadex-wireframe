import React from 'react';
import { fetchCKAN } from '../lib/ckan';
import { LinkReport, LinkReportSearchResult } from '../types/ckan';

interface DatasetHealthSummaryProps {
    resourceIds: string[];
}

const DatasetHealthSummary = async ({ resourceIds }: DatasetHealthSummaryProps) => {
    if (!resourceIds || resourceIds.length === 0) return null;

    // Fetch all reports
    const response = await fetchCKAN<LinkReportSearchResult>('check_link_report_search', { attached_only: 'true' }, { ignoreErrors: true, method: 'POST' });
    const allReports = response?.results || [];

    const reports = resourceIds.map(id => allReports.find(r => r.resource_id === id)).filter(Boolean) as LinkReport[];
    
    if (reports.length === 0) {
        return <span className="h-2 w-2 rounded-full bg-gray-300" title="Status onbekend"></span>;
    }

    const allUp = reports.every(r => r.state === 'up');
    const anyBroken = reports.some(r => r.state !== 'up' && r.state !== 'pending');

    if (anyBroken) {
        return <span className="h-2 w-2 rounded-full bg-red-500" title="Eén of meer links onbereikbaar"></span>;
    }

    if (allUp) {
        return <span className="h-2 w-2 rounded-full bg-green-500" title="Alle links beschikbaar"></span>;
    }

    return <span className="h-2 w-2 rounded-full bg-gray-300" title="Status onvolledig"></span>;
};

export default DatasetHealthSummary;
