import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { SecureField } from './SecureField';
import { DecryptFormValues } from '@/types/forms';
import { decodeEncryptedValue, decryptPayload } from '@/utils/crypto';
import { ResultCard } from '@/components/results/ResultCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';

const decryptSchema = z.object({
    encryptedCode: z.string().min(1, 'Encrypted code is required'),
    encryptionKey: z.string().min(1, 'Encryption key is required'),
});

interface DecryptState {
    cardNumber?: string;
    pin?: string;
}

export function DecryptForm() {
    const [result, setResult] = useState<DecryptState | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isBusy, setIsBusy] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DecryptFormValues>({
        resolver: zodResolver(decryptSchema),
        defaultValues: {
            encryptedCode: '',
            encryptionKey: '',
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        setIsBusy(true);
        setErrorMessage('');

        try {
            const encryptedValue = decodeEncryptedValue(values.encryptedCode.trim());
            const decrypted = decryptPayload(encryptedValue, values.encryptionKey);

            // Support the $$$ delimited plain format, falling back to JSON payloads.
            if (typeof decrypted === 'string' && decrypted.includes('$$$')) {
                const [cardNumberRaw, pinRaw] = decrypted.split('$$$');
                const cardNumber = cardNumberRaw?.trim();
                const pin = pinRaw?.trim();

                if (!cardNumber || !pin) throw new Error('Invalid payload');

                setResult({ cardNumber, pin });
            } else {
                const parsed = JSON.parse(decrypted) as DecryptState;
                if (!parsed.cardNumber || !parsed.pin) throw new Error('Invalid payload');
                setResult(parsed);
            }

            toast.success('Decrypted successfully');
        } catch {
            setResult(null);
            setErrorMessage('Unable to decrypt. Please verify encryption key and encrypted value.');
        }

        setIsBusy(false);
    });

    const handleClear = () => {
        reset();
        setResult(null);
        setErrorMessage('');
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <section className="surface p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Decrypt Data</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Recover the original card number and PIN from an encoded encryption payload.
                        </p>
                    </div>
                    <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 sm:block">
                        Ctrl/Cmd + Enter
                    </div>
                </div>

                <form className="mt-6 space-y-5" onSubmit={onSubmit}>
                    <Controller
                        control={control}
                        name="encryptedCode"
                        render={({ field }) => (
                            <SecureField
                                label="Encrypted Code"
                                description="URL-encoded AES payload"
                                error={errors.encryptedCode?.message}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Paste encrypted code"
                                autoComplete="off"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="encryptionKey"
                        render={({ field }) => (
                            <SecureField
                                label="Encryption Key"
                                description="Must match the encrypting key"
                                error={errors.encryptionKey?.message}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter encryption key"
                                type={showKey ? 'text' : 'password'}
                                autoComplete="off"
                                showToggle
                                isVisible={showKey}
                                onToggleVisibility={() => setShowKey((current) => !current)}
                            />
                        )}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="submit" className="button-primary" disabled={isBusy} data-submit-primary="true">
                            <KeyRound className="h-4 w-4" />
                            <span>{isBusy ? 'Decrypting' : 'Decrypt'}</span>
                        </button>
                        <button type="button" className="button-secondary" onClick={handleClear} data-clear-primary="true">
                            <RotateCcw className="h-4 w-4" />
                            <span>Clear</span>
                        </button>
                    </div>
                </form>
            </section>

            <section className="space-y-4">
                {errorMessage ? <ErrorAlert message={errorMessage} /> : null}

                <ResultCard
                    title="Recovered Details"
                    description="Sensitive values are shown only after a successful local decrypt operation."
                    value={result ? JSON.stringify(result, null, 2) : ''}
                    highlighted={Boolean(result)}
                    emptyState={
                        <EmptyState
                            title="Waiting for encrypted input"
                            description="Paste a valid code and key to reveal the protected payload."
                        />
                    }
                    secureContent={
                        result ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Card Number</p>
                                    <p className="mt-2 break-all text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {result.cardNumber}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">PIN</p>
                                    <p className="mt-2 text-sm font-semibold tracking-[0.3em] text-slate-900 dark:text-slate-100">
                                        {result.pin}
                                    </p>
                                </div>
                            </div>
                        ) : null
                    }
                />

                <div className="surface p-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Security note: all decryption happens in-browser. No secrets are persisted or transmitted.
                </div>
            </section>
        </div>
    );
}
