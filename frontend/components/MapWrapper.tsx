'use client';

import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 italic">
            Laden van de kaart...
        </div>
    )
});

export default function MapWrapper() {
    return <DynamicMap />;
}