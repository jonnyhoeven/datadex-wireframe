import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faMap, faTable, faCloudArrowDown, faLink } from '@fortawesome/free-solid-svg-icons';
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
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="fa-solid mr-3 text-gray-400 text-sm" />
                        <span className="font-bold text-sm"><a href={res.url}>{res.name}</a></span>
                    </button>

                ))}
            </div>
            <a href="/gebruik" className="text-blue-600 text-xs font-medium underline block mt-2">
                Meer informatie over gebruik services
            </a>
        </div>
    );
};

export const PreviewCard: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
    // Determine what previews make sense based on resources
    const hasMapServices = dataset.resources?.some(r => ['WMS', 'WFS', 'MVT'].includes(r.format?.toUpperCase() || ''));
    
    return (
        <div className="card">
            <h3 className="font-bold mb-4 text-gray-700">Preview</h3>
            {hasMapServices && (
                <button className="btn-outline">
                    <FontAwesomeIcon icon={faMap} className="mr-3 text-gray-400 text-sm" />
                    <span className="font-bold text-sm">Kaart</span>
                </button>
            )}
            <button className="btn-outline">
                <FontAwesomeIcon icon={faTable} className="mr-3 text-gray-400 text-sm" />
                <span className="font-bold text-sm">Table</span>
            </button>
            <button className="btn-outline">
                <FontAwesomeIcon icon={faCloudArrowDown} className="mr-3 text-gray-400 text-sm" />
                <span className="font-bold text-sm">Download</span>
            </button>
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
            <h3 className="font-bold mb-4">Status</h3>
            <div>
                <div className="text-xs text-gray-500">Metadata laatste wijziging</div>
                <div className="font-bold text-sm">{formatDate(dataset.metadata_modified)}</div>
            </div>
            <div>
                <div className="text-xs text-gray-500">Status metadata</div>
                <div className="flex items-center text-sm font-medium text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> {dataset.state === 'active' ? 'Actief' : 'Consistent'}
                </div>
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
            <div>
                <div className="text-xs text-gray-500">Status gegevens</div>
                <div className="flex items-center text-sm font-medium text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Actueel
                </div>
            </div>
        </div>
    );
};

export const RelatedObjectsCard: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
    // Combine relationships as subjects and objects
    const related = [
        ...(dataset.relationships_as_subject || []),
        ...(dataset.relationships_as_object || [])
    ];

    if (related.length === 0) {
        return null;
    }

    return (
        <div className="card">
            <h3 className="font-bold mb-4">Gerelateerde objecten</h3>
            <ul className="space-y-2 text-sm">
                {related.map((obj, i) => (
                    <li key={i}>
                        <a href="#" className="flex items-center text-blue-600 hover:underline">
                            {obj.object_id || obj.subject_id} <FontAwesomeIcon icon={faLink} className="ml-2 text-xs text-gray-400" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const KeywordsCard: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
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
            <PreviewCard dataset={dataset} />
            <StatusCard dataset={dataset} />
            <RelatedObjectsCard dataset={dataset} />
            <KeywordsCard dataset={dataset} />
        </aside>
    );
};

export default Sidebar;
