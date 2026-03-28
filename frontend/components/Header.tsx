import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-regular-svg-icons';

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <Link href="/"><img src="/nipv.svg" alt="NIPV Logo" className="h-10 w-auto" /></Link>
                <Link href="/"><h1 className="text-xl font-bold">Data4OOV Catalogus</h1></Link>
            </div>

            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">DMO</div>
            </div>
        </header>
    );
};

export default Header;
