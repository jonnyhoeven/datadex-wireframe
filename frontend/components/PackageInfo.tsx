import React from 'react';
import MapWrapper from './MapWrapper';
import ResourceHealth from './ResourceHealth';

export interface InfoRowProps {
    label: string;
    value: string | React.ReactNode;
    border?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({label, value, border = true}) => (
    <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="col-span-2">{value}</span>
    </div>
);

interface DescriptionProps {
    text: string;
    links: { label: string; url: string; id?: string }[];
}

export const Description: React.FC<DescriptionProps> = ({text, links}) => (
    <div className="mb-8">
        <h3 className="font-bold mb-2">Beschrijving</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {text}
        </p>
        <h3 className="font-bold text-sm mb-2">Meer informatie:</h3>
        <ul className="text-xs space-y-2 text-gray-500">
            {links ? links.map((link, index) => (
                <li key={index} className="flex flex-wrap items-center">
                    <span className="font-medium">{link.label}:</span> 
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1 break-all">
                        {link.url}
                    </a>
                    {link.id && (
                        <React.Suspense fallback={<span className="ml-2 text-[10px] text-gray-400">Status laden...</span>}>
                            <ResourceHealth resourceId={link.id} />
                        </React.Suspense>
                    )}
                </li>
            )) : null}
        </ul>
    </div>
);

export const MapPreview: React.FC = () => (
    <div className="rounded-xl overflow-hidden border border-gray-200 mb-8 bg-gray-50">
        <div className="relative h-64 md:h-80 w-full z-0">
            <MapWrapper />
        </div>
    </div>
);

export const MetadataTable: React.FC<{ extras?: Array<{ key: string; value: any }> }> = ({ extras }) => (
    <div>
        <h3 className="font-bold mb-4">Metadata velden</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                <tr>
                    <th className="px-4 py-2 font-medium">Sleutel</th>
                    <th className="px-4 py-2 font-medium">Waarde</th>
                </tr>
                </thead>
                <tbody id="metadata-body" className="divide-y divide-gray-100">
                {extras && extras.length > 0 ? (
                    extras.map((extra, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 font-medium text-gray-700">{extra.key}</td>
                            <td className="px-4 py-2 text-gray-600">{String(extra.value)}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={2} className="px-4 py-3 text-center text-gray-400 italic">
                            Geen aanvullende metadata beschikbaar.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    </div>
);
