'use client'

import { navigation } from '@/data/navigation'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export default function Aside() {
    const pathname = usePathname()
    return (
        <aside className="w-full bg-white dark:bg-slate-800 p-4 shadow-lg rounded-br-lg h-max">
            <h2 className="text-2xl font-semibold mb-2">Navigation</h2>
            <nav>
                <ul className="grid gap-4">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <a
                                href={item.href}
                                className={cn(
                                    item.href === pathname
                                        ? 'text-blue-500'
                                        : 'text-gray-800 dark:text-gray-200',
                                    'block'
                                )}
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}
