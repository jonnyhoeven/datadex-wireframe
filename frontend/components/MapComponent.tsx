'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js/Webpack
// (Even though we use polygons here, it's good practice to include in case markers are added later)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mock data representing different risk zones (Hoog, Matig, Laag)
const mockData = {
    highRisk: [
        [52.09, 5.12],
        [52.10, 5.13],
        [52.11, 5.10],
        [52.09, 5.10],
    ] as [number, number][],
    moderateRisk: [
        [52.11, 5.10],
        [52.12, 5.08],
        [52.10, 5.07],
        [52.09, 5.10],
    ] as [number, number][],
    lowRisk: [
        [52.09, 5.10],
        [52.10, 5.07],
        [52.07, 5.08],
        [52.08, 5.12],
    ] as [number, number][]
};

const MapComponent: React.FC = () => {
    // Determine the center based on mock data points
    const center: [number, number] = [52.09, 5.10]; // Near Utrecht roughly

    return (
        <MapContainer 
            center={center} 
            zoom={12} 
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Polygon positions={mockData.highRisk} pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.5 }}>
                <Popup>Hoog risico</Popup>
            </Polygon>

            <Polygon positions={mockData.moderateRisk} pathOptions={{ color: 'orange', fillColor: '#facc15', fillOpacity: 0.5 }}>
                <Popup>Matig risico</Popup>
            </Polygon>

            <Polygon positions={mockData.lowRisk} pathOptions={{ color: 'green', fillColor: '#22c55e', fillOpacity: 0.5 }}>
                <Popup>Laag risico</Popup>
            </Polygon>
        </MapContainer>
    );
};

export default MapComponent;
