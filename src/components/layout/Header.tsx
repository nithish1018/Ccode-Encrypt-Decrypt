import { ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

export function Header() {
    return (
        <header className="border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/75">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            Ccode Encrypter Decrypter
                        </p>
                    </div>
                </div>

                <ThemeToggle />
            </div>
        </header>
    );
}
