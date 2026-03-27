import React from 'react';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';

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

                    <SearchBar placeholder="Doorzoek het CKAN archief (bijv. Water )..." />
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Highlighted Dataset */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Uitgelicht</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Percelen in bezit van woningcorporaties</h2>
                        <p className="text-gray-600 mb-6 line-clamp-3">
                            A GeoSpatial Dataset for testing purposes.
                        </p>
                        <Link href="/dataset/percelen-in-bezit-van-woningcorporaties" className="text-[#004562] font-semibold hover:underline flex items-center gap-1">
                            Bekijk dataset details
                            <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>

                    {/* Backend API Info */}
                    <div className="bg-[#004562] text-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Voor Ontwikkelaars</div>
                        <h2 className="text-2xl font-bold mb-3">Powered by ckan</h2>
                        <p className="text-blue-100 mb-6 leading-relaxed">
                            Het Data4OOV portaal draait op een robuuste ckan backend. Applicaties kunnen data naadloos via de proxy benaderen via <code>/api</code>.
                        </p>
                        <a href="/api" className="text-white font-semibold hover:underline flex items-center gap-1">
                            Gebruik de ckan API tester
                            <span aria-hidden="true">&rarr;</span>
                        </a>
                        <a href="/api/3/action/status_show" className="text-white font-semibold hover:underline flex items-center gap-1">
                           Direct verbinden naar de ckan API
                            <span aria-hidden="true">&rarr;</span>
                        </a>

                        <div>
                            <h4 className="mt-3">While developing links:</h4>
                            <a href="http://localhost:4000" className="text-white font-semibold hover:underline flex items-center gap-1">
                                Login to ckan (use: admin - password)
                                <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
