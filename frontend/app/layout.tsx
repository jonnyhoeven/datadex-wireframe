import React from "react";
import './globals.css';

export default function DashboardLayout({children }){
    return (
        <html lang="nl">
        <head>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Data4OOV Catalogus - Risico Index Natuurbranden</title>
        </head>
            <body>
                {children}
            </body>
        </html>
    )
}