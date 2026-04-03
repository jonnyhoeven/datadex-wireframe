"use client";

import React, {useState, useEffect, useMemo} from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
    ExternalLink,
    Check
} from 'lucide-react';
import Link from 'next/link';

const defaultTitle = 'brand bij schouwburg'
const defaultDomain = 'brandweer'

export interface PredictApiTesterProps {
    initialDomeinOptions?: {value: string, label: string}[];
    initialLayerOptions?: {value: string, label: string}[];
}

const PredictApiTester = ({ initialDomeinOptions = [], initialLayerOptions = [] }: PredictApiTesterProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize state from URL or defaults
    const [title, setTitle] = useState(() => searchParams.get('q') ?? defaultTitle);
    
    // Support an explicit empty parameter to denote "no domains selected"
    const [selectedDomeinValues, setSelectedDomeinValues] = useState<string[]>(() => {
        const d = searchParams.get('d');
        if (d === '') return [];
        if (d) return d.split(',');
        return [defaultDomain];
    });
    
    const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    const toggleDomein = (value: string) => {
        setSelectedDomeinValues(prev => {
            const current = new Set(prev);
            if (current.has(value)) current.delete(value);
            else current.add(value);
            return Array.from(current);
        });
    };

    const toggleLayer = (value: string) => {
        setSelectedLayers(prev => prev.includes(value) ? prev.filter(l => l !== value) : [...prev, value]);
    };

    // Auto-predict on initial mount or when user navigates using Browser Back/Forward
    useEffect(() => {
        const currentQ = searchParams.get('q') ?? defaultTitle;
        const rawD = searchParams.get('d');
        const currentD = rawD === '' ? [] : rawD ? rawD.split(',') : [defaultDomain];
        
        // Sync local inputs if URL changed externally (Back/Forward)
        setTitle(currentQ);
        setSelectedDomeinValues(currentD);
        
        // Perform the prediction based on the newly navigated URL
        performPredict(currentQ, currentD);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const performPredict = async (searchTitle: string, searchDomeinen: string[]) => {
        setLoading(true);
        setResponse(null);
        setSelectedLayers([]);

        try {
            const res = await fetch('/predict/api', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: searchTitle,
                    domeinen: searchDomeinen
                })
            });
            const data = await res.json();
            setResponse({status: res.status, ok: res.ok, data});

            if (res.ok && data.predicted_layers) {
                setSelectedLayers(data.predicted_layers);
            }
        } catch (error: any) {
            setResponse({error: error.message || String(error)});
        } finally {
            setLoading(false);
        }
    };

    const handlePredict = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // Push current form state to URL (this will trigger the useEffect to fetch)
        const params = new URLSearchParams(searchParams.toString());
        params.set('q', title);
        params.set('d', selectedDomeinValues.length > 0 ? selectedDomeinValues.join(',') : '');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const copyToClipboard = (text: string) => {
        const el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 w-full">
            {/* Header / Hero Section */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-center text-left">
                        <div className="flex-1">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lightblue/10 text-brand-lightblue font-semibold text-sm mb-4">
                                <BrainCircuit size={16}/>
                                <span>Activity Predictor v1.0</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                                Activity <span className="text-brand-lightblue">Predictor Demo</span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                                Ontdek hoe AI helpt bij het ontsluiten van de juiste data. Onze Activity Predictor
                                suggereert automatisch de meest relevante kaartlagen op basis van incidenttitels en
                                betrokken domeinen. Let op het huidige model is gebaseerd op <a
                                href={"https://github.com/jonnyhoeven/datadex-wireframe/blob/main/tensorflow/mockdata.yaml"}>mock
                                data</a>
                            </p>
                        </div>

                        {/* Quick start card */}
                        <div className="w-full md:w-80 shrink-0">
                            <div
                                className="bg-brand-lightblue bg-gradient-to-br from-black/20 to-transparent text-white p-6 rounded-2xl shadow-xl transform ">
                                <h2 className="text-xl font-bold mb-3">Probeer het zelf</h2>
                                <p className="text-sm opacity-90 mb-6 leading-relaxed">
                                    Vul een scenario in en zie hoe de Machine Learning pipeline direct kaartlagen
                                    voorspelt.
                                </p>
                                <button
                                    onClick={() => document.getElementById('predictor-console')?.scrollIntoView({behavior: 'smooth'})}
                                    className="bg-white text-brand-lightblue w-full px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    Start Demo <ArrowRight size={16}/>
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
                                    {icon: <Zap size={18}/>, label: 'Real-time Suggesties'},
                                    {icon: <Layers size={18}/>, label: 'Automatische Selectie'},
                                    {icon: <Search size={18}/>, label: 'Contextueel Begrip'},
                                    {icon: <Cpu size={18}/>, label: 'Gedistribueerde ML'}
                                ].map((item, idx) => (
                                    <li key={idx}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm c transition-colors group">
                                        <span className="text-brand-lightblue">{item.icon}</span>
                                        <span
                                            className="font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-left">
                            <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-2">
                                <Microscope size={18}/>
                                Technologie
                            </h4>
                            <p className="text-sm text-blue-700 leading-relaxed mb-4">
                                We maken gebruik van <strong>RobBERT</strong> voor taalbegrip
                                en <strong>TensorFlow</strong> voor de voorspellingen.
                            </p>
                            <Link href="https://pieter.ai/robbert/" target="_blank"
                                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                Meer over RobBERT <ChevronRight size={12}/>
                            </Link>
                        </section>
                    </aside>

                    {/* Content Area */}
                    <div className="lg:col-span-2 space-y-12 order-1 lg:order-2 text-left">

                        {/* Predictor Console */}
                        <section id="predictor-console"
                                 className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Terminal className="text-brand-lightblue"/>
                                Predictor Console
                            </h2>

                            <form onSubmit={handlePredict} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-sm mb-2 text-gray-700">Titel van het scenario</label>
                                        <input
                                            type="text"
                                            className="bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-lightblue outline-none transition-shadow font-medium"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="bijv. Brand in parkeergarage"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-sm mb-2 text-gray-700">Betrokken Domeinen</label>
                                        <div className="flex flex-wrap gap-2">
                                            {initialDomeinOptions.map(opt => {
                                                const isSelected = selectedDomeinValues.includes(opt.value);
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => toggleDomein(opt.value)}
                                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg border flex items-center gap-2 transition-all duration-200 ${
                                                            isSelected
                                                                ? 'bg-brand-lightblue text-white border-brand-lightblue shadow-sm'
                                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        {isSelected && <Check size={14} />}
                                                        {opt.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-brand-lightblue hover:bg-brand-lightblue-dark transition-colors text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20}/>
                                            <span>Analyseren...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={20}/>
                                            <span>Kaartlagen Selecteren</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-end mb-3">
                                        <label className="font-semibold text-sm text-gray-700">Voorspelde Kaartlagen</label>
                                        {response?.ok && (
                                            <span
                                                className="text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
                                                <Zap size={10}/> AI Gesuggereerd
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                                        {loading ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                                <Loader2 className="animate-spin mb-2" size={24} />
                                                <span className="text-sm">Bezig met analyseren...</span>
                                            </div>
                                        ) : response?.ok && response?.data?.predicted_layers ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Gesuggereerd door AI</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {response.data.predicted_layers.map((layer: string) => (
                                                            <button
                                                                key={layer}
                                                                type="button"
                                                                onClick={() => toggleLayer(layer)}
                                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg border flex items-center gap-2 transition-all ${
                                                                    selectedLayers.includes(layer)
                                                                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                                                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {selectedLayers.includes(layer) && <Check size={14} className="text-blue-600" />}
                                                                {layer}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-sm text-gray-500">
                                                Nog geen voorspelling gedaan. Start de demo voor AI-suggesties.
                                            </div>
                                        )}
                                    </div>
                                    
                                    <p className="mt-3 text-xs text-gray-500 italic flex items-center gap-1">
                                        <Info size={14}/>
                                        {response?.ok
                                            ? "De AI heeft de meest relevante lagen bovenaan gezet en automatisch geselecteerd."
                                            : loading ? "Het AI model verwerkt uw aanvraag..." : "Lagen verschijnen hier zodra u de analyse start."}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Hoe het werkt sectie */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen className="text-brand-lightblue"/>
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
                                              className="text-xs font-semibold text-brand-lightblue hover:underline flex items-center gap-1">
                                            Details <ExternalLink size={12}/>
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
                                        <Copy size={18}/>
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

