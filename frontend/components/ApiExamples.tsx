"use client";

import React, {useState} from 'react';
import {Code, Copy, Check} from 'lucide-react';

const ApiExamples = () => {
    const [activeTab, setActiveTab] = useState('js');
    const [copied, setCopied] = useState(false);

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
curl 'https://data4oov.nl/ckan/api/3/action/package_search?q=water' 
     -H 'Accept: application/json'`
    };

    return (
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
    );
};

export default ApiExamples;
