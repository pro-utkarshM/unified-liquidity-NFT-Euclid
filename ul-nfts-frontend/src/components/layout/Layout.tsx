import { ReactNode } from 'react';
import { Notifications } from '../shared/Notifications';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
            <Notifications />
        </div>
    );
};