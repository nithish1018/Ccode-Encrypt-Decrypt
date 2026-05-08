import { ReactNode } from 'react';
import { Header } from './Header';

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
        </div>
    );
}
