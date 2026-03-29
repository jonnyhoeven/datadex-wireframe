"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    Terminal,
    ArrowRight,
    Layers,
    Search,
    ChevronRight,
    Loader2,
    Info,
    BrainCircuit,
    Zap,
    Microscope,
    Cpu,
    Copy,
    BookOpen,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const defaultTitle = 'brand bij schouwburg'
const defaultDomain = 'brandweer'
const Select = dynamic(() => import('react-select'), { ssr: false });

const PredictApiTester = () => {
    const [mounted, setMounted] = useState(false);
    const [title, setTitle] = useState(defaultTitle);
    const [selectedDomeinen, setSelectedDomeinen] = useState<any>([]);
    const [selectedLayers, setSelectedLayers] = useState<any>([]);
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [domeinOptions, setDomeinOptions] = useState<any>([]);
    const [allLayerOptions, setAllLayerOptions] = useState<any>([]);

    useEffect(() => {
        setMounted(true);
        fetch('/predict/api')
            .then(res => res.json())
            .then(data => {
                if (data.metadata?.domeinen_classes) {
                    const dOptions = data.metadata.domeinen_classes.map((d: string) => ({ value: d, label: d }));
                    setDomeinOptions(dOptions);
                    setSelectedDomeinen([dOptions.find((o: any) => o.value === defaultDomain)].filter(Boolean));
                }
                if (data.metadata?.layers_classes) {
                    const lOptions = data.metadata.layers_classes.map((l: string) => ({ value: l, label: l }));
                    setAllLayerOptions(lOptions);
                }
            })
            .catch(err => console.error('Error fetching metadata:', err));
    }, []);

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);
        setSelectedLayers([]);

        try {
            const res = await fetch('/predict/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    domeinen: selectedDomeinen.map((d: any) => d.value)
                })
            });
            const data = await res.json();
            setResponse({ status: res.status, ok: res.ok, data });

            if (res.ok && data.predicted_layers) {
                const predicted = data.predicted_layers.map((l: string) => ({ value: l, label: l }));
                setSelectedLayers(predicted);
            }
        } catch (error: any) {
            setResponse({ error: error.message || String(error) });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        const el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    // Build grouped options for the Layers select
    const getGroupedLayerOptions = () => {
        if (!response?.data?.predicted_layers) {
            return allLayerOptions;
        }

        const predictedSet = new Set(response.data.predicted_layers);
        const suggested = allLayerOptions.filter((o: any) => predictedSet.has(o.value));
        const others = allLayerOptions.filter((o: any) => !predictedSet.has(o.value));

        return [
            {
                label: 'Gesuggereerd door AI',
                options: suggested
            },
            {
                label: 'Overige lagen',
                options: others
            }
        ];
    };

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#75b9d8]" size={48} />
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
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75b9d8]/10 text-[#75b9d8] font-semibold text-sm mb-4">
                                <BrainCircuit size={16} />
                                <span>Activity Predictor v1.0</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                                Activity <span className="text-[#75b9d8]">Predictor Demo</span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                                Ontdek hoe AI helpt bij het ontsluiten van de juiste data. Onze Activity Predictor
                                suggereert automatisch de meest relevante kaartlagen op basis van incidenttitels en
                                betrokken domeinen.
                            </p>
                        </div>

                        {/* Snel aan de slag Card */}
                        <div className="w-full md:w-80 shrink-0">
                            <div
                                className="bg-[#75b9d8] bg-gradient-to-br from-black/20 to-transparent text-white p-6 rounded-2xl shadow-xl transform ">
                                <h2 className="text-xl font-bold mb-3">Probeer het zelf</h2>
                                <p className="text-sm opacity-90 mb-6 leading-relaxed">
                                    Vul een scenario in en zie hoe de Machine Learning pipeline direct kaartlagen
                                    voorspelt.
                                </p>
                                <button
                                    onClick={() => document.getElementById('predictor-console')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-white text-[#75b9d8] w-full px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    Start Demo <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Sidebar / Navigatie */}
                    <aside className="lg:col-span-1 space-y-8 order-2 lg:order-1">
                        <section>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Mogelijkheden</h3>
                            <ul className="space-y-3 text-left">
                                {[
                                    { icon: <Zap size={18} />, label: 'Real-time Suggesties' },
                                    { icon: <Layers size={18} />, label: 'Automatische Selectie' },
                                    { icon: <Search size={18} />, label: 'Contextueel Begrip' },
                                    { icon: <Cpu size={18} />, label: 'Gedistribueerde ML' }
                                ].map((item, idx) => (
                                    <li key={idx}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm c transition-colors group">
                                        <span className="text-[#75b9d8]">{item.icon}</span>
                                        <span
                                            className="font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-left">
                            <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-2">
                                <Microscope size={18} />
                                Technologie
                            </h4>
                            <p className="text-sm text-blue-700 leading-relaxed mb-4">
                                We maken gebruik van <strong>RobBERT</strong> voor taalbegrip
                                en <strong>TensorFlow</strong> voor de voorspellingen.
                            </p>
                            <Link href="https://pieter.ai/robbert/" target="_blank"
                                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                Meer over RobBERT <ChevronRight size={12} />
                            </Link>
                        </section>
                    </aside>

                    {/* Content Area */}
                    <div className="lg:col-span-2 space-y-12 order-1 lg:order-2 text-left">

                        {/* Predictor Console */}
                        <section id="predictor-console"
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Terminal className="text-[#75b9d8]" />
                                Predictor Console
                            </h2>
                            <form onSubmit={handlePredict} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-sm mb-2 text-gray-700">Titel van het
                                            scenario</label>
                                        <input
                                            type="text"
                                            className="bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#75b9d8] outline-none transition-shadow font-medium"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="bijv. Brand in parkeergarage"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-sm mb-2 text-gray-700">Betrokken
                                            Domeinen</label>
                                        <Select
                                            instanceId="domeinen-select"
                                            isMulti
                                            options={domeinOptions}
                                            value={selectedDomeinen}
                                            onChange={setSelectedDomeinen}
                                            className="text-sm"
                                            placeholder="Selecteer domeinen..."
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: '0.5rem',
                                                    padding: '2px',
                                                    borderColor: '#d1d5db',
                                                    backgroundColor: '#f9fafb'
                                                })
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#75b9d8] hover:bg-[#5da7c8] transition-colors text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Analyseren...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={20} />
                                            <span>Kaartlagen Voorspellen</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-end mb-3">
                                        <label className="font-semibold text-sm text-gray-700">Voorspelde
                                            Kaartlagen</label>
                                        {response?.ok && (
                                            <span
                                                className="text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
                                                <Zap size={10} /> AI Gesuggereerd
                                            </span>
                                        )}
                                    </div>
                                    <Select
                                        instanceId="layers-select"
                                        isMulti
                                        options={getGroupedLayerOptions()}
                                        value={selectedLayers}
                                        onChange={setSelectedLayers}
                                        className="text-sm"
                                        placeholder="Wacht op voorspelling..."
                                        noOptionsMessage={() => "Geen lagen gevonden"}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '0.5rem',
                                                padding: '2px',
                                                borderColor: '#d1d5db',
                                                backgroundColor: '#f9fafb'
                                            })
                                        }}
                                    />
                                    <p className="mt-3 text-xs text-gray-500 italic flex items-center gap-1">
                                        <Info size={14} />
                                        {response?.ok
                                            ? "De AI heeft de meest relevante lagen bovenaan gezet en automatisch geselecteerd."
                                            : "Nog geen voorspelling gedaan. Start de demo voor AI-suggesties."}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Hoe het werkt sectie */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen className="text-[#75b9d8]" />
                                Hoe het werkt
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: '1. Taal Begrijpen',
                                        desc: 'Het AI-taalmodel RobBERT begrijpt de context van jouw tekst en vertaalt deze naar wiskundige vectoren.',
                                        link: 'https://pieter.ai/robbert/'
                                    },
                                    {
                                        title: '2. Neuraal Netwerk',
                                        desc: 'Een TensorFlow model combineert tekstvectoren met domeinen om de waarde van elke kaartlaag te bepalen.',
                                        link: 'https://www.tensorflow.org/'
                                    },
                                    {
                                        title: '3. Orkestratie',
                                        desc: 'De applicatie koppelt resultaten direct aan de kaart, waardoor hulpdiensten sneller kunnen handelen.',
                                        link: 'https://github.com/jonnyhoeven/datadex-wireframe/tree/main/tensorflow'
                                    }
                                ].map((step, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h4 className="font-bold text-gray-900">{step.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {step.desc}
                                        </p>
                                        <Link href={step.link} target="_blank"
                                            className="text-xs font-semibold text-[#75b9d8] hover:underline flex items-center gap-1">
                                            Details <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* API Response debug section */}
                        {response && (
                            <section>
                                <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                                    <span className="flex items-center gap-2">Volledig API antwoord</span>
                                    {response.status && (
                                        <span
                                            className={`text-xs px-3 py-1 rounded-full text-white font-mono ${response.ok ? 'bg-green-500' : 'bg-red-500'}`}>
                                            HTTP {response.status}
                                        </span>
                                    )}
                                </h3>
                                <div className="relative group">
                                    <pre
                                        className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed shadow-inner max-h-[400px]">
                                        <code>{JSON.stringify(response.data || response.error, null, 2)}</code>
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(JSON.stringify(response.data || response.error, null, 2))}
                                        className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-all border border-gray-700 opacity-0 group-hover:opacity-100"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PredictApiTester;
