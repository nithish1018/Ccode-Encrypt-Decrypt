import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, RotateCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { CopyButton } from '@/components/results/CopyButton';
import { ResultCard } from '@/components/results/ResultCard';
import { SecureField } from './SecureField';
import { DecryptedPayload, EncryptFormValues } from '@/types/forms';
import { decodeEncryptedValue, encodeEncryptedValue, encryptPayload } from '@/utils/crypto';
import { EmptyState } from '@/components/feedback/EmptyState';

const encryptSchema = z.object({
    cardNumber: z.preprocess(
        (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : value),
        z.string().min(1, 'Card number is required').regex(/^\d{13,16}$/, 'Card number must contain 13 to 16 digits'),
    ),
    pin: z.preprocess(
        (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : value),
        z.string().min(1, 'PIN is required').regex(/^\d{4,8}$/, 'PIN must contain 4 to 8 digits'),
    ),
    encryptionKey: z.string().min(1, 'Encryption key is required'),
});

interface EncryptFormProps {
    onResultChange?: (result: string) => void;
}

function formatCardNumber(value: string) {
    return value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

export function EncryptForm({ onResultChange }: EncryptFormProps) {
    const [result, setResult] = useState('');
    const [rawVisible, setRawVisible] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EncryptFormValues>({
        resolver: zodResolver(encryptSchema),
        defaultValues: {
            cardNumber: '',
            pin: '',
            encryptionKey: '',
        },
    });

    const displayedResult = useMemo(() => {
        if (!result) {
            return '';
        }

        return rawVisible ? decodeEncryptedValue(result) : result;
    }, [rawVisible, result]);

    const onSubmit = handleSubmit(async (values) => {
        setIsBusy(true);

        // Use $$$ separator (cardNumber$$$pin) to match expected external format
        const plain = `${values.cardNumber.replace(/\s/g, '')}$$$${values.pin}`;

        const encrypted = encryptPayload(plain, values.encryptionKey);
        const encoded = encodeEncryptedValue(encrypted);

        setResult(encoded);
        onResultChange?.(encoded);
        toast.success('Encrypted successfully', {
            description: 'Encrypted code is ready to use.',
        });
        setIsBusy(false);
    });

    const handleClear = () => {
        reset();
        setResult('');
        setRawVisible(false);
        onResultChange?.('');
    };

    const handleCopy = async () => {
        if (!displayedResult) {
            return;
        }

        await navigator.clipboard.writeText(displayedResult);
        toast.success('Copied Successfully');
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <section className="surface p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Encrypt Data</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Generate a URL-encoded AES-256-CBC value entirely in your browser.
                        </p>
                    </div>
                    <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 sm:block">
                        Ctrl/Cmd + Enter
                    </div>
                </div>

                <form className="mt-6 space-y-5" onSubmit={onSubmit}>
                    <Controller
                        control={control}
                        name="cardNumber"
                        render={({ field }) => (
                            <SecureField
                                label="Card Number"
                                description="13-16 digits"
                                error={errors.cardNumber?.message}
                                value={field.value}
                                onChange={(value) => field.onChange(formatCardNumber(value))}
                                placeholder="1234 5678 9012 3456"
                                inputMode="numeric"
                                maxLength={19}
                                autoComplete="off"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="pin"
                        render={({ field }) => (
                            <SecureField
                                label="PIN"
                                description="4-8 digits"
                                error={errors.pin?.message}
                                value={field.value}
                                onChange={(value) => field.onChange(value.replace(/\D/g, '').slice(0, 8))}
                                placeholder="••••"
                                type="password"
                                inputMode="numeric"
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
                                description="Secret passphrase"
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
                            {isBusy ? <Copy className="h-4 w-4 animate-pulse" /> : <ShieldCheck className="h-4 w-4" />}
                            <span>{isBusy ? 'Encrypting' : 'Encrypt'}</span>
                        </button>
                        <button type="button" className="button-secondary" onClick={handleClear} data-clear-primary="true">
                            <RotateCcw className="h-4 w-4" />
                            <span>Clear</span>
                        </button>
                    </div>
                </form>
            </section>

            <section className="space-y-4">
                <ResultCard
                    title="Encrypted Output"
                    description="Use the URL-encoded value for transfer and storage in downstream systems."
                    value={displayedResult}
                    highlighted={Boolean(displayedResult)}
                    emptyState={
                        <EmptyState
                            title="Ready to encrypt"
                            description="Fill in the fields on the left to generate a secure code."
                        />
                    }
                    actions={
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <input
                                    type="checkbox"
                                    checked={rawVisible}
                                    onChange={(event) => setRawVisible(event.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-slate-100"
                                />
                                Show raw Base64
                            </label>
                            <CopyButton value={displayedResult} onCopy={handleCopy} />
                        </div>
                    }
                />

                <div className="surface p-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    All encryption and decryption is performed locally in your browser. No API calls, storage, or logging.
                </div>
            </section>
        </div>
    );
}
