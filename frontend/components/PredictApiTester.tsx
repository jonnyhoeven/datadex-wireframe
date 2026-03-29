"use client";

import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), {ssr: false});

const PredictApiTester = () => {
    const [title, setTitle] = useState('brand bij schouwburg');
    const [selectedDomeinen, setSelectedDomeinen] = useState<any>([]);
    const [selectedLayers, setSelectedLayers] = useState<any>([]);
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [domeinOptions, setDomeinOptions] = useState<any>([]);
    const [allLayerOptions, setAllLayerOptions] = useState<any>([]);

    useEffect(() => {
        fetch('/predict/api')
            .then(res => res.json())
            .then(data => {
                if (data.metadata?.domeinen_classes) {
                    const dOptions = data.metadata.domeinen_classes.map((d: string) => ({value: d, label: d}));
                    setDomeinOptions(dOptions);
                    setSelectedDomeinen([dOptions.find((o: any) => o.value === 'brandweer')].filter(Boolean));
                }
                if (data.metadata?.layers_classes) {
                    const lOptions = data.metadata.layers_classes.map((l: string) => ({value: l, label: l}));
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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title,
                    domeinen: selectedDomeinen.map((d: any) => d.value)
                })
            });
            const data = await res.json();
            setResponse({status: res.status, ok: res.ok, data});

            if (res.ok && data.predicted_layers) {
                const predicted = data.predicted_layers.map((l: string) => ({value: l, label: l}));
                setSelectedLayers(predicted);
            }
        } catch (error: any) {
            setResponse({error: error.message || String(error)});
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="p-8 w-full max-w-4xl mx-auto">
            {/* Introductie Sectie */}
            <div className="mb-12">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                    Welkom bij de <span className="text-[#004562]">Activity Predictor Demo</span>!
                </h2>

                <div className="prose prose-blue max-w-none text-gray-600 space-y-4">
                    <p className="leading-relaxed">
                        Je kijkt nu naar de interactieve testomgeving voor ons slimme voorspellingsmodel. Maar wat
                        gebeurt er nu eigenlijk op de achtergrond wanneer je hier een incident of activiteit invoert?
                    </p>

                    <p className="leading-relaxed">
                        Stel je voor dat er een melding binnenkomt van een <span className="italic">"brand in een schouwburg"</span>.
                        Om effectief te kunnen handelen, hebben hulpdiensten direct de juiste kaartlagen nodig op hun
                        scherm—denk aan gebouwindelingen, brandkranen in de buurt of aanrijroutes. Deze tool is
                        ontworpen om <strong className="text-gray-900">automatisch de meest relevante kaartlagen te
                        suggereren</strong>, puur op basis van de titel van het incident en de betrokken hulpdiensten
                        (zoals Brandweer of Politie).
                    </p>

                    <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 my-8">
                        <h3 className="text-xl font-bold text-[#004562] mb-4">Hoe de magie werkt</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-2">1. Taal Begrijpen</h4>
                                <p className="text-sm">
                                    We gebruiken een krachtig AI-taalmodel (<strong className="text-blue-800"><a
                                    href="https://pieter.ai/robbert/" target="_blank">RobBERT</a></strong>) dat de
                                    dieperliggende betekenis en context van jouw tekst begrijpt en vertaalt naar
                                    wiskundige vectoren.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-2">2. De Voorspelling</h4>
                                <p className="text-sm">
                                    Ons <strong className="text-blue-800"><a href="https://www.tensorflow.org/"
                                                                             target="_blank">Neurale
                                    Netwerk</a></strong> (het 'brein') combineert de tekst met de gekozen domeinen om te
                                    bepalen welke kaartlagen cruciaal zijn voor dit scenario op basis van bestaande
                                    activiteiten.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-2">3. De Orkestrator</h4>
                                <p className="text-sm">
                                    Deze applicatie fungeert als dirigent: het koppelt het taalmodel aan het brein en
                                    vertaalt de resultaten direct naar bruikbare kaartlagen op jouw scherm.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="font-bold text-gray-900">Probeer het zelf!</p>
                    <p>
                        Vul een incident in en selecteer de betrokken domeinen. Je maakt op dit moment live gebruik van
                        een gedistribueerde <span className="italic">machine learning pipeline</span> die natuurlijke
                        taal direct omzet in operationele inzichten.
                    </p>
                </div>
            </div>

            {/* API Tester Formulier */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Test het model</h3>
                <form onSubmit={handlePredict} className="space-y-6">
                    <div className="flex flex-col w-full">
                        <label className="font-semibold text-sm mb-1 text-gray-700">Titel</label>
                        <input
                            type="text"
                            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="bijv. Brand in parkeergarage"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="font-semibold text-sm mb-1 text-gray-700">Domeinen</label>
                        <Select
                            instanceId="domeinen-select"
                            isMulti
                            options={domeinOptions}
                            value={selectedDomeinen}
                            onChange={setSelectedDomeinen}
                            className="text-sm"
                            placeholder="Selecteer domeinen..."
                        />
                    </div>

                    <button type="submit"
                            className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded font-medium w-full md:w-auto"
                            disabled={loading}>
                        {loading ? 'Bezig met analyseren...' : 'Kaartlagen Voorspellen'}
                    </button>
                </form>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-end mb-1">
                        <label className="font-semibold text-sm text-gray-700">Kaartlagen</label>
                        {response?.ok && (
                            <span
                                className="text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    AI Gesuggereerd
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
                        placeholder="Selecteer kaartlagen..."
                        noOptionsMessage={() => "Geen lagen gevonden"}
                    />
                    <p className="mt-2 text-xs text-gray-500 italic">
                        {response?.ok
                            ? "De AI heeft de meest relevante lagen bovenaan gezet en geselecteerd."
                            : "Nog geen voorspelling gedaan. Alle lagen zijn hieronder beschikbaar."}
                    </p>
                </div>
            </div>
            {response && (
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                        Volledige API antwoord
                        {response.status && (
                            <span
                                className={`text-sm px-2 py-1 rounded text-white ${response.ok ? 'bg-green-500' : 'bg-red-500'}`}>
                                {response.status}
                            </span>
                        )}
                    </h3>
                    <div className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                            {JSON.stringify(response.data || response.error, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictApiTester;
