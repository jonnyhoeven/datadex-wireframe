"use client";

import React from 'react';
import {Terminal, ChevronRight} from 'lucide-react';

interface EndpointListProps {
    onEndpointClick: (method: string, endpoint: string) => void;
}

const EndpointList: React.FC<EndpointListProps> = ({onEndpointClick}) => {
    const endpoints = [
        {
            method: 'GET',
            path: '/ckan/api/3/action/package_list',
            desc: 'Lijst met alle datasets'
        },
        {
            method: 'GET',
            path: '/ckan/api/3/action/package_search?q={query}',
            desc: 'Zoeken in metadata'
        },
        {
            method: 'GET',
            path: '/ckan/api/3/action/organization_list',
            desc: 'Overzicht van alle organisaties'
        },
        {
            method: 'GET',
            path: '/ckan/api/3/action/package_show?id={id}',
            desc: 'Details van een specifieke dataset'
        }
    ];

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Terminal className="text-brand-orange"/>
                Belangrijkste Eindpunten
            </h2>
            <div className="space-y-4">
                {endpoints.map((endpoint, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-4 rounded-lg border border-gray-200 flex items-start sm:items-center gap-4 group hover:border-brand-orange transition-colors cursor-pointer"
                        onClick={() => {
                            onEndpointClick(endpoint.method, endpoint.path.replace('/ckan/api/3/action/', ''));
                            const element = document.getElementById('api-tester');
                            element?.scrollIntoView({behavior: 'smooth'});
                        }}
                    >
                        <span
                            className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-mono font-bold">
                            {endpoint.method}
                        </span>
                        <div className="flex-1">
                            <code className="text-sm font-mono text-brand-orange font-semibold break-all">
                                {endpoint.path}
                            </code>
                            <p className="text-xs text-gray-500 mt-1">{endpoint.desc}</p>
                        </div>
                        <ChevronRight size={16}
                                      className="text-gray-300 group-hover:text-brand-orange transition-colors"/>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EndpointList;
