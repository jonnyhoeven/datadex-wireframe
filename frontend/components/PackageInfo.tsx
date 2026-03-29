import React from 'react';

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
