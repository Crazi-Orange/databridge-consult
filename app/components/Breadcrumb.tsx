'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    return (
        <nav className='text-sm mb-4 text-gray-500 dark:text-gray-400 mb-4' aria-label='Breadcrumb'>
            <ol className="flex flex-wrap items-center space-x-2">
                <li>
                    <Link href="/" className='text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:text-blue-400 transition-colors'>
                        Home 
                    </Link> 
                </li>
                {segments.map((segment, index) => {
                    const href = '/' + segments.slice(0, index + 1).join('/');
                    const isLast = index === segments.length - 1;
                    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
                    
                    return (
                        <li key={href} className="flex items-center space-x-2">
                            <span className='text-gray-400'></span>
                            {isLast ? (
                                <span className='font-semi-bold text-gray-900 dark:text-white'>{label}</span>
                            ) : (
                                <Link href={href} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:text-blue-400 transition-colors">
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>

    );
}