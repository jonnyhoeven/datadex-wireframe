import React from 'react';
import Link from 'next/link';
import { Dataset } from '../types/ckan';
import { InfoRow, Description } from './PackageInfo';

interface DatasetCardProps {
    dataset: Dataset;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
    return (
        <div className="card">
            <h2 className="text-2xl font-bold mb-6">
                <Link href={'/dataset/' + dataset.name} className="hover:text-[#004562] transition-colors">
                    {dataset.title}
                </Link>
            </h2>
            <div className="space-y-4 mb-8">
                <InfoRow label="Type" value={dataset.type}/>
                <InfoRow label="Bron" value={dataset.organization?.title}/>
                <InfoRow label="Classificatie" value={dataset.private ? 'Prive' : 'Openbaar'}/>
                <InfoRow label="Licentie" value={dataset.license_title}/>
                <InfoRow
                    label="Thema's"
                    border={false}
                    value={
                        <div className="flex flex-wrap gap-2">
                            {dataset.tags?.map((tag) => (
                                <Link
                                    key={tag.name}
                                    href={`/tag/${encodeURIComponent(tag.display_name)}`}
                                >
                                    <div className="tag hover:bg-gray-200 transition-colors text-[#004562] border border-gray-100">
                                        {tag.display_name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    }
                />
            </div>

            <Description
                text={dataset.notes || ''}
                links={dataset.resources?.map((r: any) => ({ label: r.name, url: r.url })) || []}
            />
        </div>
    );
};
