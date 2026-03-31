"use client";

import React, {useState} from 'react';
import {
    Database,
    ArrowRight,
    ExternalLink,
    Info,
    Layers,
    Search,
} from 'lucide-react';
import Link from 'next/link';
import ApiConsole from "./ApiConsole";
import EndpointList from "./EndpointList";
import ApiExamples from "./ApiExamples";

const CkanApiTester = () => {
    const [method, setMethod] = useState('GET');
    const [endpoint, setEndpoint] = useState('package_show?id=water');

    const handleEndpointClick = (method: string, endpoint: string) => {
        setMethod(method);
        setEndpoint(endpoint);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 w-full">
            {/* Header / Hero Section */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-center text-left">
                        <div className="flex-1">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange font-semibold text-sm mb-4">
                                <Database size={16}/>
                                <span>CKAN Backend v3</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                                API Toegang <span className="text-brand-orange">Data4OOV</span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                                Ontsluit de kracht van open data voor Openbare Orde en Veiligheid. Onze robuuste CKAN
                                API stelt ontwikkelaars in staat om naadloos metadata te doorzoeken, filteren en
                                integreren in externe applicaties.
                            </p>
                        </div>

                        {/* Quick start card */}
                        <div className="w-full md:w-80 shrink-0">
                            <div
                                className="bg-brand-orange bg-gradient-to-br   from-black/20 to-transparent text-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-transform">
                                <h2 className="text-xl font-bold mb-3">Snel aan de slag</h2>
                                <p className="text-sm opacity-90 mb-6 leading-relaxed">
                                    Direct toegang tot alle metadata via <code>/ckan/api</code> op deze site.
                                </p>
                                <Link
                                    href="https://docs.ckan.org/en/latest/api/index.html"
                                    target="_blank"
                                    className="bg-white text-brand-orange px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    Documentatie openen <ArrowRight size={16}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-8 order-2 lg:order-1">
                        <section>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Kernfunctionaliteiten</h3>
                            <ul className="space-y-3 text-left">
                                {[
                                    {icon: <Search size={18}/>, label: 'Metadata Doorzoeken'},
                                    {icon: <Layers size={18}/>, label: 'Organisatie Inzichten'},
                                    {icon: <Database size={18}/>, label: 'Resources Downloaden'},
                                    {icon: <Info size={18}/>, label: 'Versiebeheer'}
                                ].map((item, idx) => (
                                    <li key={idx}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm group">
                                        <span className="text-brand-orange">{item.icon}</span>
                                        <span
                                            className="font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-left">
                            <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-2">
                                <Info size={18}/>
                                API Key nodig?
                            </h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Voor publieke data is geen API-key vereist. Wil je data uploaden of private datasets
                                inzien? Neem dan contact op met het Data4OOV beheerteam.
                            </p>
                        </section>
                    </aside>

                    {/* Content Area */}
                    <div className="lg:col-span-2 space-y-12 order-1 lg:order-2 text-left">

                        <ApiConsole
                            method={method}
                            setMethod={setMethod}
                            endpoint={endpoint}
                            setEndpoint={setEndpoint}
                        />

                        <EndpointList onEndpointClick={handleEndpointClick}/>

                        <ApiExamples/>

                        {/* Call to Action */}
                        <section
                            className="bg-white border-2 border-dashed border-gray-200 p-8 rounded-2xl text-center">
                            <h3 className="text-xl font-bold mb-3">Klaar om te bouwen?</h3>
                            <p className="text-gray-600 mb-6">
                                Bekijk de volledige officiële CKAN API documentatie voor geavanceerde opties zoals
                                filtering en data-pushes.
                            </p>
                            <Link
                                href="https://docs.ckan.org/en/latest/api/index.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all hover:scale-105"
                            >
                                Officiële Docs <ExternalLink size={18}/>
                            </Link>
                        </section>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default CkanApiTester;
