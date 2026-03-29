'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapResourceLink {
    label: string;
    url: string;
    id: string;
    format?: string;
}

export interface MapProps {
    links?: MapResourceLink[];
}

const WmsAutoLayer: React.FC<{ url: string; label: string }> = ({ url, label }) => {
    const [layers, setLayers] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [baseUrl] = useState<string>(url.split('?')[0]);

    useEffect(() => {
        const fetchCapabilities = async () => {
            try {
                const capsUrl = new URL(url);
                capsUrl.searchParams.set('SERVICE', 'WMS');
                capsUrl.searchParams.set('REQUEST', 'GetCapabilities');
                
                const response = await fetch(capsUrl.toString());
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const text = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, "text/xml");
                
                const nameNodes = xmlDoc.querySelectorAll('Layer > Name');
                const layerNames = Array.from(nameNodes)
                    .map(node => node.textContent)
                    .filter(name => name && name.length > 0) as string[];

                if (layerNames.length > 0) {
                    const uniqueLayers = Array.from(new Set(layerNames)).join(',');
                    setLayers(uniqueLayers);
                } else {
                    setError("Geen lagen gevonden");
                }
            } catch (e) {
                console.error("WMS fetch error:", e);
                setError("Fout bij ophalen");
            }
        };
        fetchCapabilities();
    }, [url]);

    if (error) {
        return <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded text-[10px] z-[1000] font-bold">{error}</div>;
    }

    if (!layers) return null;

    return (
        <WMSTileLayer
            url={baseUrl}
            layers={layers}
            format="image/png"
            transparent={true}
            attribution={label}
        />
    );
};

const MapComponent: React.FC<MapProps> = ({ links }) => {
    const center: [number, number] = [52.09, 5.10];

    const geoLinks = links?.filter(l =>
        ['wms'].includes(l.format?.toLowerCase() || '')
    ) || [];

    if (geoLinks.length === 0) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 italic text-sm">
                Geen kaart-bronnen (WMS) gevonden.
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            {geoLinks.map((link) => (
                <div key={link.id} className="relative h-64 md:h-80 w-full border border-gray-200 rounded-lg overflow-hidden mb-4">
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
                        <WmsAutoLayer url={link.url} label={link.label} />
                    </MapContainer>
                    <div className="absolute top-2 left-12 bg-white/90 px-3 py-1 rounded text-xs font-semibold z-[1000] border border-gray-200 shadow-sm">
                        {link.label} (WMS)
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MapComponent;