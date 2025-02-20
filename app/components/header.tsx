import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'
import Image from 'next/image'

export default async function Header() {
    const user = await currentUser()
    return (
        <header className="w-full border-b px-6">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="font-bold text-2xl">
                    <Image
                        width={100}
                        height={100}
                        alt="Your Company"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTezdfcU9njA1vtJ9KO_XAZuRbP6jNakpw7JA&s"
                        className="h-8 w-auto"
                    />
                </Link>

                <nav className="flex gap-4">
                    {!user && (
                        <>
                            <Link href="/auth/login">
                                <Button variant="ghost">Connexion</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button variant="ghost">Inscription</Button>
                            </Link>
                        </>
                    )}
                    <Link href="/dashboard">
                        <Button>Tableau de bord</Button>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
