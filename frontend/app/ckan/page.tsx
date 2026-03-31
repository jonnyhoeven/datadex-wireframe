"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import {Loader2} from "lucide-react";

const CkanApiTester = dynamic(() => import('../../components/CkanApiTester'), {
    ssr: false,
    loading: () => <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-orange" size={48}/>
    </div>
});

export default function CkanPage() {
    return <CkanApiTester/>;
}
