'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import { Layers, Loader2, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const Select = dynamic(() => import('react-select'), { ssr: false });

export interface MapResourceLink {
    label: string;
    url: string;
    id: string;
    format?: string;
}

export interface MapProps {
    links?: MapResourceLink[];
}

interface LayerOption {
    value: string;
    label: string;
}

/**
 * Individual Map Item that handles its own WMS Capabilities fetching and layer selection.
 */
const WmsMapItem: React.FC<{ link: MapResourceLink }> = ({ link }) => {
    const center: [number, number] = [52.09, 5.10];
    const [options, setOptions] = useState<LayerOption[]>([]);
    const [selectedLayers, setSelectedLayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [baseUrl] = useState<string>(link.url.split('?')[0]);

    useEffect(() => {
        const fetchCapabilities = async () => {
            setLoading(true);
            try {
                const capsUrl = new URL(link.url);
                capsUrl.searchParams.set('SERVICE', 'WMS');
                capsUrl.searchParams.set('REQUEST', 'GetCapabilities');
                
                const response = await fetch(capsUrl.toString());
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const text = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, "text/xml");
                
                const nameNodes = xmlDoc.querySelectorAll('Layer > Name');
                const layerOptions = Array.from(nameNodes)
                    .map(node => ({
                        value: node.textContent || '',
                        label: node.textContent || ''
                    }))
                    .filter(opt => opt.value.length > 0);

                if (layerOptions.length > 0) {
                    setOptions(layerOptions);
                    // Default to selecting only the first layer
                    setSelectedLayers([layerOptions[0]]);
                } else {
                    setError("Geen lagen gevonden");
                }
            } catch (e) {
                console.error("WMS Capabilities fetch error:", e);
                setError("Fout bij ophalen");
            } finally {
                setLoading(false);
            }
        };

        fetchCapabilities();
    }, [link.url]);

    const selectedString = selectedLayers?.map(s => s.value).join(',') || '';

    return (
        <div className="relative w-full border border-gray-200 rounded-lg overflow-hidden mb-8 bg-white shadow-sm">
            {/* Header with Label and Dropdown */}
            <div className="p-3 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#75b9d8]/10 rounded-md text-[#75b9d8]">
                        <Layers size={16} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-800">{link.label}</h4>
                        <p className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">{baseUrl}</p>
                    </div>
                </div>

                <div className="flex-1 max-w-md">
                    <Select
                        instanceId={`select-${link.id}`}
                        isMulti
                        options={options}
                        value={selectedLayers}
                        onChange={(val) => setSelectedLayers(val as any[])}
                        placeholder={loading ? "Laden..." : "Selecteer lagen..."}
                        className="text-xs"
                        noOptionsMessage={() => error || "Geen lagen gevonden"}
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderRadius: '0.6rem',
                                padding: '0px',
                                borderColor: '#e5e7eb',
                                backgroundColor: 'white',
                                minHeight: '32px',
                                fontSize: '12px'
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                padding: '2px 8px'
                            })
                        }}
                    />
                </div>
            </div>

            {/* Map Area */}
            <div className="relative h-64 md:h-96 w-full bg-gray-100">
                {loading && (
                    <div className="absolute inset-0 z-[1001] bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-[#75b9d8]" size={24} />
                            <span className="text-xs font-medium text-gray-500">Kaartlagen ophalen...</span>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="absolute inset-0 z-[1001] bg-red-50/30 flex items-center justify-center">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-red-100 flex items-center gap-2 text-red-600 text-sm font-semibold">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    </div>
                )}

                <MapContainer 
                    center={center} 
                    zoom={7}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {selectedString && (
                        <WMSTileLayer
                            url={baseUrl}
                            layers={selectedString}
                            format="image/png"
                            transparent={true}
                            attribution={link.label}
                        />
                    )}
                </MapContainer>
            </div>
            
            <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-medium">
                    {selectedLayers?.length || 0} van de {options.length} lagen geselecteerd
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#75b9d8] bg-[#75b9d8]/10 px-2 py-0.5 rounded">
                    WMS Service
                </span>
            </div>
        </div>
    );
};

const MapComponent: React.FC<MapProps> = ({ links }) => {
    const geoLinks = links?.filter(l =>
        ['wms'].includes(l.format?.toLowerCase() || '')
    ) || [];

    if (geoLinks.length === 0) {
        return (
            <div className="p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Layers className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-400 italic text-sm">
                    Geen kaart-bronnen (WMS) gevonden voor deze dataset.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {geoLinks.map((link) => (
                <WmsMapItem key={link.id} link={link} />
            ))}
        </div>
    );
};

export default MapComponent;