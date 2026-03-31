import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <Link href="/">
                    <Image src="/nipv.svg" alt="NIPV Logo" width={40} height={40} className="h-10 w-auto" loading="eager"/>
                </Link>
                <Link href="/"><h1 className="text-xl font-bold">Data4OOV</h1></Link>
            </div>

            <div className="flex items-center space-x-6">
                <nav className="flex space-x-4 mr-4">
                    <Link href="/status" className="text-sm font-medium text-gray-600 hover:text-brand-blue">Status</Link>
                </nav>
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">DMO</div>
            </div>
        </header>
    );
};

export default Header;
