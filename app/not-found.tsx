import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold mb-4">404</h2>
            <p className="text-xl mb-8">Page non trouvée</p>
            <Link href="/dashboard" className="text-primary hover:underline">
                Retourner à l'accueil
            </Link>
        </div>
    )
}
