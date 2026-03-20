import React from "react";
import './globals.css';
import type {Metadata} from 'next';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

import Header from '../components/Header';

export const metadata: Metadata = {
    title: "Data4OOV Catalogus - Risico Index Natuurbranden",
    description: "Data4OOV Catalogus",
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
        <main className="max-w-6xl mx-auto p-6 lg:flex lg:gap-8">
            {children}
        </main>
        <footer className="py-8 text-center text-gray-800 text-sm">
            <p>&copy; {new Date().getFullYear()} NIPV - Data4OOV</p>
        </footer>
        </body>
        </html>
    )
}