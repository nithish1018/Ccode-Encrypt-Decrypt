import { motion } from 'framer-motion';
import { LockKeyhole, KeyRound } from 'lucide-react';
import { Mode } from '@/types/forms';

interface ModeSwitcherProps {
    value: Mode;
    onChange: (mode: Mode) => void;
}

const modes: Array<{ value: Mode; label: string; description: string; icon: typeof LockKeyhole }> = [
    {
        value: 'encrypt',
        label: 'Encrypt Data',
        description: 'Create a protected URL-safe code',
        icon: LockKeyhole,
    },
    {
        value: 'decrypt',
        label: 'Decrypt Data',
        description: 'Recover card data from an encrypted code',
        icon: KeyRound,
    },
];

export function ModeSwitcher({ value, onChange }: ModeSwitcherProps) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {modes.map((mode) => {
                const active = value === mode.value;
                const Icon = mode.icon;

                return (
                    <button
                        key={mode.value}
                        type="button"
                        onClick={() => onChange(mode.value)}
                        className={`relative overflow-hidden rounded-xl border p-4 text-left transition ${active
                                ? 'border-slate-900 bg-slate-900 text-white shadow-panel dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900'
                            }`}
                    >
                        {active ? (
                            <motion.div
                                layoutId="active-mode-indicator"
                                className="absolute inset-0 rounded-xl border border-transparent"
                                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            />
                        ) : null}
                        <div className="relative flex items-start gap-3">
                            <div className={`rounded-lg p-2 ${active ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{mode.label}</p>
                                <p
                                    className={`mt-1 text-xs leading-5 ${
                                        active ? 'text-white/75 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                                    }`}
                                >
                                    {mode.description}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
