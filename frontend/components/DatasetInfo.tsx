import React from 'react';

interface InfoRowProps {
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
    links: { label: string; url: string }[];
}

export const Description: React.FC<DescriptionProps> = ({text, links}) => (
    <div className="mb-8">
        <h3 className="font-bold mb-2">Beschrijving</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {text}
        </p>
        <h3 className="font-bold text-sm mb-2">Meer informatie:</h3>
        <ul className="text-xs space-y-1 text-gray-500">
            {links ? links.map((link, index) => (
                <li key={index}>
                    {link.label}: <a href="#" className="text-blue-600 underline">{link.url}</a>
                </li>
            )) : null}
        </ul>
    </div>
);

export const MapPreview: React.FC = () => (
    <div className="rounded-xl overflow-hidden border border-gray-200 mb-8 bg-gray-50">
        <div className="relative h-64 md:h-80 flex items-center justify-center">
            <div className="absolute inset-0 opacity-40"
                 style={{
                     backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                     backgroundSize: '20px 20px'
                 }}>
            </div>
            <div className="z-10 bg-white p-4 rounded shadow-sm border border-gray-200">
                <div className="grid grid-cols-6 gap-1 w-48">
                    {[
                        'bg-green-400', 'bg-green-300', 'bg-yellow-300', 'bg-yellow-400', 'bg-red-400', 'bg-red-500',
                        'bg-green-500', 'bg-yellow-400', 'bg-red-500', 'bg-red-600', 'bg-yellow-400', 'bg-green-400'
                    ].map((color, idx) => (
                        <div key={idx} className={`h-4 ${color}`}></div>
                    ))}
                </div>
                <p className="text-[10px] text-center mt-2 text-gray-400 italic">Kaart preview visualisatie</p>
            </div>
            <div className="absolute top-2 right-2 bg-white/90 p-2 text-[10px] border border-gray-200 rounded">
                <div className="font-bold border-b mb-1">Legenda</div>
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-red-500 rounded-sm"></span> <span>Hoog risico</span>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-sm"></span> <span>Matig risico</span>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-sm"></span> <span>Laag risico</span>
                </div>
            </div>
        </div>
    </div>
);

export const MetadataTable: React.FC = () => (
    <div>
        <h3 className="font-bold mb-4">Metadata velden</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                <tr>
                    <th className="px-4 py-2 font-medium">Naam</th>
                    <th className="px-4 py-2 font-medium">Titel</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium">Beschrijving</th>
                    <th className="px-4 py-2 font-medium">Eenheid</th>
                </tr>
                </thead>
                <tbody id="metadata-body" className="divide-y divide-gray-100">
                <tr className="animate-pulse">
                    <td colSpan={5} className="px-4 py-3 text-center text-gray-400 italic">
                        Laden van metadata...
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
);
