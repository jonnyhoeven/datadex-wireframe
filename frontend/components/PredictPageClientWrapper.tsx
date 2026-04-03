"use client";

import React, { Suspense } from 'react';
import PredictApiTester from './PredictApiTester';
import type { PredictApiTesterProps } from './PredictApiTester';

function LoadingPlaceholder() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4 text-gray-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-lightblue"></div>
                <p className="text-lg font-medium italic">Systeem en referentiedata initialiseren...</p>
            </div>
        </div>
    );
}

export default function PredictPageClientWrapper(props: PredictApiTesterProps) {
    return (
        <Suspense fallback={<LoadingPlaceholder />}>
            <PredictApiTester {...props} />
        </Suspense>
    );
}
