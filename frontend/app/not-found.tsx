import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
    return (
        <div className="w-full bg-gray-50 flex flex-col font-sans text-gray-900">
            <div className="flex-grow container mx-auto px-6 py-16 flex items-center justify-center">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <Image
                        src="/nipv-full.svg"
                        alt="Not Found Hero"
                        width={300}
                        height={300}
                        className="mx-auto mb-10"
                    />
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                        Pagina niet beschikbaar
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        404
                    </p>
                    <Link href="/" className="inline-block bg-[#004562] text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all">
                        terug naar home
                    </Link>
                </div>
            </div>
        </div>
    )
}