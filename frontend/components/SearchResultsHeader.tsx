import React from 'react';

interface SearchResultsHeaderProps {
    count: number;
    query: string;
}

export const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({ count, query }) => {
    const getCountText = () => {
        if (count === 0) return 'Geen resultaten';
        if (count === 1) return '1 resultaat';
        return `${count} resultaten`;
    };

    return (
        <div className="card">
            <h4 className="text-2xl font-bold">
                {getCountText()} gevonden voor: <i>{query}</i>
            </h4>
        </div>
    );
};
