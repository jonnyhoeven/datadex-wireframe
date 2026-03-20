import React from "react";
import './globals.css';
import type {Metadata} from 'next';
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
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        </head>
        <body>
        <Header />
        <main className="max-w-6xl mx-auto p-6 lg:flex lg:gap-8">
            {children}
        </main>
        </body>
        </html>
    )
}