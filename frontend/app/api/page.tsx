"use client";

import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMoon} from "@fortawesome/free-regular-svg-icons";
import Link from 'next/link';
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";

const ApiTester = () => {
    const [method, setMethod] = useState('GET');
    const [endpoint, setEndpoint] = useState('package_show?id=water');
    const [requestBody, setRequestBody] = useState('{\n  "q": "water"\n}');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleTestApi = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const options: RequestInit = {
                method,
                headers: {
                    'Accept': 'application/json',
                }
            };

            if (method === 'POST' || method === 'PUT') {
                options.headers = {
                    ...options.headers,
                    'Content-Type': 'application/json'
                };
                // Only attach body if there's actual content
                if (requestBody.trim()) {
                    options.body = requestBody;
                }
            }

            // Call the local rewrite which proxies to the CKAN container
            const res = await fetch(`/api/3/action/${endpoint.replace(/^\/+/, '')}`, options);

            const data = await res.json();
            setResponse({status: res.status, ok: res.ok, data});
        } catch (error: any) {
            setResponse({error: error.message || String(error)});
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="lg:w-1/1">
                <div className="card">
                    <h2 className="text-2xl font-bold mb-6">CKAN API Tester</h2>

                    <div className="space-y-4 mb-8">
                        <p className="text-gray-600 mb-4">
                            Test hier de ckan Public API van Data4OOV
                        </p>

                        <form onSubmit={handleTestApi} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex flex-col w-full sm:w-1/4">
                                    <label className="font-semibold text-sm mb-1 text-gray-700">Method</label>
                                    <select
                                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={method}
                                        onChange={(e) => setMethod(e.target.value)}
                                    >
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                    </select>
                                </div>

                                <div className="flex flex-col w-full sm:w-3/4">
                                    <label className="font-semibold text-sm mb-1 text-gray-700">Action /
                                        Endpoint</label>
                                    <div className="flex items-stretch w-full">
                                        <span
                                            className="bg-gray-100 p-2 border border-gray-300 border-r-0 rounded-l text-gray-500 whitespace-nowrap">
                                            /api/3/action/
                                        </span>
                                        <input
                                            type="text"
                                            className="border border-gray-300 p-2 rounded-r w-full focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                            value={endpoint}
                                            onChange={(e) => setEndpoint(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {(method === 'POST' || method === 'PUT') && (
                                <div className="flex flex-col w-full">
                                    <label className="font-semibold text-sm mb-1 text-gray-700">Request Body
                                        (JSON)</label>
                                    <textarea
                                        className="border border-gray-300 p-2 rounded w-full h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={requestBody}
                                        onChange={(e) => setRequestBody(e.target.value)}
                                    />
                                </div>
                            )}

                            <button type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded font-medium"
                                    disabled={loading}>
                                {loading ? 'Sending...' : 'Send Request'}
                            </button>
                        </form>
                    </div>

                    {response && (
                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                Response
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
                    <Link href="https://docs.ckan.org/en/2.9/api/" target="_blank">
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare}
                                         className="fa-solid mr-3 text-gray-400 text-sm"/>
                        <span className="font-bold text-sm">API documentatie</span>.
                    </Link>

                </div>
            </div>
        </>
    );
};

export default ApiTester;