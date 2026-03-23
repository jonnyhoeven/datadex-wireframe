'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//     iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//     shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

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

        </MapContainer>
    );
};

export default MapComponent;
