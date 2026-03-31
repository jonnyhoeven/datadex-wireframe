"use client";

import React, {useState} from 'react';
import {Terminal, Send, Loader2, Copy} from 'lucide-react';

interface ApiConsoleProps {
    method: string;
    setMethod: (method: string) => void;
    endpoint: string;
    setEndpoint: (endpoint: string) => void;
}

const ApiConsole: React.FC<ApiConsoleProps> = ({method, setMethod, endpoint, setEndpoint}) => {
    const [requestBody, setRequestBody] = useState('{\n  "q": "water"\n}');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const copyToClipboard = (text: string) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
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

    return (
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
    );
}

export default ApiConsole;
