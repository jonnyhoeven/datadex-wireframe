'use client';

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

const MapComponent: React.FC<MapProps> = ({ links }) => {
    const center: [number, number] = [52.09, 5.10]; // Near Utrecht roughly

    return (
        <MapContainer 
            center={center} 
            zoom={6.5}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <WMSTileLayer
                url="https://geodata.zuid-holland.nl/geoserver/water/wms"
                layers="HHDELFLAND_AFSLUITER,HHDELFLAND_INSPECTIEPUT"
                format="image/png"
                transparent={true}
                attribution="@todo api retrieval"
            />

        </MapContainer>
    );
};

export default MapComponent;