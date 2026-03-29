import React from 'react';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import { InfoRow } from "../components/PackageInfo";

import TopTags from '../components/TopTags';
import LatestDatasets from '../components/LatestDatasets';
import { BrainCircuit, PackagePlus, Cable, HandHeart } from "lucide-react";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

            {/* Hero Section */}
            <main className="flex-grow container mx-auto px-6 py-16">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                        Hét data portaal voor <span className="text-[#004562]">Openbare Orde en Veiligheid</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Ontdek, analyseer en deel essentiële (geo-)informatie. Data4OOV maakt data toegankelijk
                        voor operationele bedrijfsvoering, beleid en onderzoek omtrent veiligheid in Nederland.
                    </p>

                    <SearchBar placeholder="Doorzoek Data4OOV (bijv. Water )..." />
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    <LatestDatasets />

                    <div className="text-[#004562] p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h2 className="text-2xl font-bold mb-3">Thema's</h2>
                        <TopTags />
                        <div className="mt-6">
                            <Link href="/tag">
                                <div className="text-[#004562] font-semibold hover:underline flex items-center gap-1 text-sm">
                                    Bekijk alle thema's
                                    <span aria-hidden="true">&rarr;</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <a href={process.env.NEXT_PUBLIC_CKAN_URL || "http://localhost:4000"} >
                        <div className="bg-[#004562] bg-gradient-to-br from-black/20 to-transparent text-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="inline-flex items-center gap-2 text-2xl font-bold mb-3">
                                <PackagePlus size={24} />
                                <span>Beheerders</span>
                            </div>
                            <p className="text-blue-100 mb-6 leading-relaxed">
                                Beheerders kunnen inloggen via de Data4OOV ckan backend om metadata te beheren.
                            </p>
                            <div className="text-white font-semibold hover:underline flex items-center gap-1">
                                Beheerportaal <span aria-hidden="true">&rarr;</span>
                            </div>
                        </div>
                    </a>

                    <a href="/predict">
                        <div className="bg-[#75b9d8] bg-gradient-to-br shadow-blue-200  from-black/20 to-transparent text-white p-8 rounded-xl shadow-sm hover:shadow-md">
                            <div className="inline-flex items-center gap-2 text-2xl font-bold mb-3">
                                <BrainCircuit size={24} />
                                <span>Activity Predictor</span>
                            </div>
                            <p className="text-blue-100 mb-6 leading-relaxed">
                                Vul een scenario in en zie hoe de Machine Learning pipeline direct relevante kaartlagen voorspelt.
                            </p>
                            <div className="text-white font-semibold hover:underline flex items-center gap-1">
                                Demo <span aria-hidden="true">&rarr;</span>
                            </div>
                        </div>
                    </a>

                    <a href="/ckan">
                        <div className="bg-[#f6a732] bg-gradient-to-br from-black/20 to-transparent text-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="inline-flex items-center gap-2 text-2xl font-bold mb-3">
                                <Cable size={24} />
                                <span>CKAN Backend v3</span>
                            </div>
                            <p className=" mb-6 leading-relaxed">
                                Data4OOV maakt gebruik van een robuuste ckan backend. Applicaties kunnen metadata vinden via de ckan <code>/api</code>.
                            </p>
                            <div className=" font-semibold hover:underline flex items-center gap-1">
                                Voorbeelden <span aria-hidden="true">&rarr;</span>
                            </div>
                        </div>
                    </a>

                    <a href="/gebruik">
                        <div className="bg-[#bb1413] bg-gradient-to-br from-black/20 to-transparent text-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="inline-flex items-center gap-2 text-2xl font-bold mb-3">
                                <HandHeart size={24} />
                                <span>Voorwaarden</span>
                            </div>
                            <p className="text-blue-100 mb-6 leading-relaxed">
                                Bij het gebruik van deze dienst gaat  akkoord met de algemene gebruiksvoorwaarden.
                            </p>
                            <div className="text-white font-semibold hover:underline flex items-center gap-1">
                                Lees meer <span aria-hidden="true">&rarr;</span>
                            </div>
                        </div>
                    </a>

                </div>
            </main>
        </div>
    );
};

export default HomePage;
