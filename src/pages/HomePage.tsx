import { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, Sparkles } from 'lucide-react';
import { ModeSwitcher } from '@/components/mode/ModeSwitcher';
import { EncryptForm } from '@/components/forms/EncryptForm';
import { DecryptForm } from '@/components/forms/DecryptForm';
import { Mode } from '@/types/forms';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function HomePage() {
    const [mode, setMode] = useState<Mode>('encrypt');

    useKeyboardShortcuts({
        activeMode: mode,
        onSubmit: () => {
            const submitButton = document.querySelector<HTMLButtonElement>('[data-submit-primary="true"]');
            submitButton?.click();
        },
        onClear: () => {
            const clearButton = document.querySelector<HTMLButtonElement>('[data-clear-primary="true"]');
            clearButton?.click();
        },
        onSwitchMode: setMode,
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
            <section className="surface overflow-hidden p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        {/* removed internal label per product requirements */}
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                            Enterprise-grade card encryption and decryption.
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                            Ccode Encrypter Decrypter protects card details using a browser-only AES-256-CBC workflow.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                            <LockKeyhole className="h-4 w-4" />
                            Local-only processing
                        </div>
                        <p className="mt-1 text-xs leading-5">No backend, no persistence, no telemetry.</p>
                    </div>
                </div>

                <div className="mt-8">
                    <ModeSwitcher value={mode} onChange={setMode} />
                </div>

                <p className="mt-4 text-xs leading-6 text-slate-500 dark:text-slate-400">
                    Shortcuts: Ctrl/Cmd+Enter submit, Esc clear, Alt+E encrypt, Alt+D decrypt.
                </p>
            </section>

            <section className="space-y-6">
                {mode === 'encrypt' ? <EncryptForm /> : <DecryptForm />}
            </section>
        </motion.div>
    );
}
