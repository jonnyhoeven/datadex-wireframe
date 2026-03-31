"use client";

import React, {useState, useEffect} from 'react';
import {
    Code,
    Terminal,
    BookOpen,
    Database,
    ArrowRight,
    Copy,
    Check,
    ExternalLink,
    Info,
    Layers,
    Search,
    ChevronRight,
    Send,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

const CkanApiTester = () => {
    const [mounted, setMounted] = useState(false);
    const [method, setMethod] = useState('GET');
    const [endpoint, setEndpoint] = useState('package_show?id=water');
    const [requestBody, setRequestBody] = useState('{\n  "q": "water"\n}');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('js');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const copyToClipboard = (text: string) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        } else {
            // Fallback for older browsers
            const el = document.createElement('textarea');
            el.value = text;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Fallback copy failed: ', err);
            }
            document.body.removeChild(el);
        }
    };

    const handleTestApi = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const options: RequestInit = {
                method,
                headers: {'Accept': 'application/json'}
            };
            if (method === 'POST' || method === 'PUT') {
                options.headers = {...options.headers, 'Content-Type': 'application/json'};
                if (requestBody.trim()) options.body = requestBody;
            }
            const res = await fetch(`/ckan/api/3/action/${endpoint.replace(/^\/+/, '')}`, options);
            const data = await res.json();
            setResponse({status: res.status, ok: res.ok, data});
        } catch (error: any) {
            setResponse({error: error.message || String(error)});
        } finally {
            setLoading(false);
        }
    };

    const codeExamples: any = {
        js: `// Voorbeeld: Haal een lijst met pakketten op via JavaScript
fetch('https://data4oov.nl/ckan/api/3/action/package_list')
  .then(response => response.json())
  .then(data => {
    console.log('Beschikbare datasets:', data.result);
  })
  .catch(error => console.error('Fout bij ophalen:', error));`,
        python: `# Voorbeeld: Gebruik de 'requests' bibliotheek in Python
import requests

url = 'https://data4oov.nl/ckan/api/3/action/package_search'
params = {'q': 'brandweer', 'rows': 5}

response = requests.get(url, params=params)
data = response.json()

if data['success']:
    for result in data['result']['results']:
        print(f"Dataset gevonden: {result['title']}")`,
        curl: `# Voorbeeld: Zoek naar datasets via cURL
curl 'https://data4oov.nl/ckan/api/3/action/package_search?q=water' \\
     -H 'Accept: application/json'`
    };

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-orange" size={48}/>
        </div>;
    }

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

                        {/* API Tester Console */}
                        <section id="api-tester" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Terminal className="text-brand-orange"/>
                                Interactieve API Console
                            </h2>
                            <form onSubmit={handleTestApi} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-sm mb-2 text-gray-700">Methode</label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none transition-shadow"
                                            value={method}
                                            onChange={(e) => setMethod(e.target.value)}
                                        >
                                            <option value="GET">GET</option>
                                            <option value="POST">POST</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col md:col-span-3">
                                        <label className="font-semibold text-sm mb-2 text-gray-700">Actie</label>
                                        <div className="flex items-stretch w-full">
                                            <span
                                                className="bg-gray-100 px-4 flex items-center border border-gray-300 border-r-0 rounded-l-lg text-gray-500 font-mono text-sm whitespace-nowrap">
                                                /ckan/api/3/action/
                                            </span>
                                            <input
                                                type="text"
                                                className="border border-gray-300 p-3 rounded-r-lg w-full focus:ring-2 focus:ring-brand-orange outline-none font-mono text-sm transition-shadow"
                                                value={endpoint}
                                                onChange={(e) => setEndpoint(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {(method === 'POST' || method === 'PUT') && (
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold text-sm mb-2 text-gray-700">Request Body
                                            (JSON)</label>
                                        <textarea
                                            className="bg-gray-50 border border-gray-300 p-4 rounded-lg w-full h-32 font-mono text-sm focus:ring-2 focus:ring-brand-orange outline-none transition-shadow"
                                            value={requestBody}
                                            onChange={(e) => setRequestBody(e.target.value)}
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="bg-brand-orange hover:bg-orange-500 transition-colors text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20}/>
                                            <span>Versturen...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20}/>
                                            <span>Versturen</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {response && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">Resultaat</span>
                                        {response.status && (
                                            <span
                                                className={`text-xs px-3 py-1 rounded-full text-white font-mono ${response.ok ? 'bg-green-500' : 'bg-red-500'}`}>
                                                HTTP {response.status}
                                            </span>
                                        )}
                                    </h3>
                                    <div className="relative group">
                                        <pre
                                            className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed shadow-inner max-h-[500px]">
                                            <code>{JSON.stringify(response.data || response.error, null, 2)}</code>
                                        </pre>
                                        <button
                                            onClick={() => copyToClipboard(JSON.stringify(response.data || response.error, null, 2))}
                                            className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-all border border-gray-700 opacity-0 group-hover:opacity-100"
                                        >
                                            <Copy size={18}/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Endpoint sction */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Terminal className="text-brand-orange"/>
                                Belangrijkste Eindpunten
                            </h2>
                            <div className="space-y-4">
                                {[
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
                                ].map((endpoint, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white p-4 rounded-lg border border-gray-200 flex items-start sm:items-center gap-4 group hover:border-brand-orange transition-colors cursor-pointer"
                                        onClick={() => {
                                            setMethod(endpoint.method);
                                            setEndpoint(endpoint.path.replace('/ckan/api/3/action/', ''));
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

                        {/* Code Voorbeelden */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Code className="text-brand-orange"/>
                                    Code Voorbeelden
                                </h2>
                                <div className="flex bg-gray-200 p-1 rounded-lg text-xs font-bold">
                                    {['js', 'python', 'curl'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setActiveTab(lang)}
                                            className={`px-3 py-1.5 rounded-md uppercase transition-all ${
                                                activeTab === lang ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative group">
                                <pre
                                    className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed shadow-lg border border-gray-800">
                                    <code>{codeExamples[activeTab]}</code>
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(codeExamples[activeTab])}
                                    className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-all border border-gray-700 shadow-lg"
                                    title="Kopieer code"
                                >
                                    {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-4 italic text-center">
                                Vervang 'https://data4oov.nl' door de actuele basis-URL van de CKAN instantie.
                            </p>
                        </section>

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
