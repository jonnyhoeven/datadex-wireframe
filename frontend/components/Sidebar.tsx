import React from 'react';

export const ServicesCard: React.FC = () => (
    <div className="card">
        <h3 className="font-bold mb-4">Services</h3>
        <div className="space-y-2">
            {['WMS', 'WFS', 'MVT'].map((service) => (
                <button key={service} className="btn-outline">
                    <i className="fa-solid fa-arrow-up-right-from-square mr-3 text-gray-400 text-sm"></i>
                    <span className="font-bold text-sm">{service}</span>
                </button>
            ))}
        </div>
        <a href="#" className="text-blue-600 text-xs font-medium underline block mt-2">
            Meer informatie over gebruik services
        </a>
    </div>
);

export const PreviewCard: React.FC = () => (
    <div className="card">
        <h3 className="font-bold mb-4 text-gray-700">Preview</h3>
        <button className="btn-outline">
            <i className="fa-solid fa-map mr-3 text-gray-400 text-sm"></i>
            <span className="font-bold text-sm">Kaart</span>
        </button>
        <button className="btn-outline">
            <i className="fa-solid fa-table mr-3 text-gray-400 text-sm"></i>
            <span className="font-bold text-sm">Table</span>
        </button>
        <button className="btn-outline">
            <i className="fa-solid fa-cloud-arrow-down mr-3 text-gray-400 text-sm"></i>
            <span className="font-bold text-sm">Download</span>
        </button>
    </div>
);

export const StatusCard: React.FC = () => (
    <div className="card space-y-4">
        <h3 className="font-bold mb-4">Status</h3>
        <div>
            <div className="text-xs text-gray-500">Metadata laatste wijziging</div>
            <div className="font-bold text-sm">12-06-2025</div>
        </div>
        <div>
            <div className="text-xs text-gray-500">Status metadata</div>
            <div className="flex items-center text-sm font-medium text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Consistent
            </div>
        </div>
        <div>
            <div className="text-xs text-gray-500">Gegevens laatste wijziging</div>
            <div className="font-bold text-sm">01-02-2026</div>
        </div>
        <div>
            <div className="text-xs text-gray-500">Bijwerk frequentie</div>
            <div className="font-bold text-sm">Dagelijks</div>
        </div>
        <div>
            <div className="text-xs text-gray-500">Status gegevens</div>
            <div className="flex items-center text-sm font-medium text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Actueel
            </div>
        </div>
    </div>
);

export const RelatedObjectsCard: React.FC = () => (
    <div className="card">
        <h3 className="font-bold mb-4">Gerelateerde objecten</h3>
        <ul className="space-y-2 text-sm">
            {['Object A', 'Object B', 'Object C'].map((obj) => (
                <li key={obj}>
                    <a href="#" className="flex items-center">
                        {obj} <i className="fa-solid fa-link ml-2 text-xs text-gray-400"></i>
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export const KeywordsCard: React.FC = () => (
    <div className="card">
        <h3 className="font-bold mb-4">Keywords</h3>
        <div className="flex flex-wrap gap-2">
            {[
                'risico index natuurbrand', 'brandveiligheid', 'rampenbestrijding',
                'crisismanagement', 'noodplanning', 'brandweer',
                'vegetatie', 'brandbaarheid', 'blusvoorzieningen'
            ].map((keyword) => (
                <span key={keyword} className="tag bg-slate-100">
                    {keyword}
                </span>
            ))}
        </div>
    </div>
);

const Sidebar: React.FC = () => {
    return (
        <aside className="lg:w-1/3">
            <ServicesCard />
            <PreviewCard />
            <StatusCard />
            <RelatedObjectsCard />
            <KeywordsCard />
        </aside>
    );
};

export default Sidebar;
