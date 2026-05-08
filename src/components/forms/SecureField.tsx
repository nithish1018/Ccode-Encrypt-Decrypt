import { Eye, EyeOff } from 'lucide-react';
import { ReactNode } from 'react';

interface SecureFieldProps {
    label: string;
    description?: string;
    error?: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'search' | 'none';
    maxLength?: number;
    rightSlot?: ReactNode;
    showToggle?: boolean;
    isVisible?: boolean;
    onToggleVisibility?: () => void;
}

export function SecureField({
    label,
    description,
    error,
    type = 'text',
    value,
    onChange,
    placeholder,
    autoComplete,
    inputMode,
    maxLength,
    rightSlot,
    showToggle,
    isVisible,
    onToggleVisibility,
}: SecureFieldProps) {
    return (
        <label className="block space-y-2">
            <div className="flex items-end justify-between gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                {description ? <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span> : null}
            </div>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    maxLength={maxLength}
                    className="input-base pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center gap-1 px-3">
                    {rightSlot}
                    {showToggle && onToggleVisibility ? (
                        <button
                            type="button"
                            onClick={onToggleVisibility}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            aria-label={isVisible ? 'Hide value' : 'Show value'}
                        >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    ) : null}
                </div>
            </div>
            {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
        </label>
    );
}
