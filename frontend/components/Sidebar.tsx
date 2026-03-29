import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Dataset } from '../types/ckan';

interface SidebarProps {
    dataset: Dataset;
}

export const ServicesCard: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
    const services = dataset.resources || []

    if (!dataset || !dataset.resources ) {
        return null;
    }

    return (
        <div className="card">
            <h3 className="font-bold mb-4">Services</h3>
            <div id="services-container" className="space-y-2">
                {services.map((res) => (

                    <button key={res.name} className="btn-outline">
                        <ExternalLink className="mr-3 text-gray-400" size={16} />
                        <span className="font-bold text-sm"><a href={res.url}>{res.name}</a></span>
                    </button>

                ))}
            </div>
        </div>
    );
};

export const StatusCard: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
    // Format date if it exists
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Onbekend';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('nl-NL');
    };

    return (
        <div className="card space-y-4">
            <h3 className="font-bold mb-4">Metadata</h3>
            <div>
                <div className="text-xs text-gray-500">Metadata laatste wijziging</div>
                <div className="font-bold text-sm">{formatDate(dataset.metadata_modified)}</div>
            </div>
            <div>
                <div className="text-xs text-gray-500">Gegevens laatste wijziging</div>
                {/* For actual data we might look at resources modified or custom extras. Fallback to metadata for now. */}
                <div className="font-bold text-sm">
                    {formatDate(dataset.resources && dataset.resources.length > 0 ? dataset.resources[0].metadata_modified : dataset.metadata_modified)}
                </div>
            </div>
            <div>
                <div className="text-xs text-gray-500">Bijwerk frequentie</div>
                {/* Find update frequency from extras if it exists, otherwise default */}
                <div className="font-bold text-sm">
                    {dataset.extras?.find((e: any) => e.key === 'frequency')?.value || 'Onbekend'}
                </div>
            </div>
        </div>
    );
};

export const TagsCard: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
    const tags = dataset.tags || [];

    if (tags.length === 0) {
        return null;
    }

    return (
        <div className="card">
            <h3 className="font-bold mb-4">Keywords</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span key={tag.id} className="tag bg-slate-100">
                        {tag.display_name}
                    </span>
                ))}
            </div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ dataset }) => {
    if (!dataset) return null;

    return (
        <aside className="lg:w-1/3 space-y-4">
            <ServicesCard dataset={dataset} />
            <StatusCard dataset={dataset} />
            <TagsCard dataset={dataset} />
        </aside>
    );
};

export default Sidebar;
