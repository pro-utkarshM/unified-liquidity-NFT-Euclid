import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../shared/Button';
import { useArchwayClient } from '../../hooks/useArchwayClient';
import { WalletIcon, HomeIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';

export const Header = () => {
    const { address, connect } = useArchwayClient();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { href: '/', label: 'Home', icon: HomeIcon },
        { href: '/marketplace', label: 'Marketplace', icon: ShoppingBagIcon },
        { href: '/portfolio', label: 'Portfolio', icon: UserIcon },
    ];

    return (
        <header className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${isScrolled ? 'bg-dark-light shadow-lg' : 'bg-transparent'}
    `}>
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gradient">UL-NFTs</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`
                  flex items-center space-x-2 py-2 px-3 rounded-lg transition-colors
                  ${router.pathname === href ? 'bg-primary text-white' : 'hover:text-primary'}
                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        {address ? (
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<WalletIcon className="w-4 h-4" />}
                            >
                                {`${address.slice(0, 6)}...${address.slice(-4)}`}
                            </Button>
                        ) : (
                            <Button
                                onClick={connect}
                                variant="primary"
                                size="sm"
                                icon={<WalletIcon className="w-4 h-4" />}
                            >
                                Connect Wallet
                            </Button>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};