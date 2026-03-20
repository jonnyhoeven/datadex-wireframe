import React from 'react';

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Data4OOV Catalogus</h1>
            <div className="flex items-center space-x-4">
                <button className="text-gray-500">
                    <i className="fa-regular fa-moon"></i>
                </button>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">BA</div>
            </div>
        </header>
    );
};

export default Header;
