import React from "react";
import './globals.css';
import type {Metadata} from 'next';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';

export const metadata: Metadata = {
    title: "Data4OOV Catalogus",
    description: "Data4OOV Catalogus - Hét data portaal voor Openbare Orde en Veiligheid",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="nl">
        <body>
        <Header />
        <main className="max-w-6xl mx-auto p-6">
            <Breadcrumbs />
            <div className="flex flex-col lg:flex-row lg:gap-8">
                {children}
            </div>
        </main>
        <footer className="bg-white border-t border-gray-200 py-12 mt-12">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Data4OOV Portal - Ondersteund door CKAN Open Data.
                </p>
            </div>
        </footer>
        </body>
        </html>
    )
}