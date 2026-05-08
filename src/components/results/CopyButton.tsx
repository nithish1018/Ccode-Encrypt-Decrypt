import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
    value: string;
    onCopy: () => Promise<void> | void;
}

export function CopyButton({ value, onCopy }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleClick = async () => {
        if (!value) {
            return;
        }

        await onCopy();
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
    };

    return (
        <button type="button" className="button-secondary px-3 py-2 text-xs font-semibold" onClick={handleClick} disabled={!value}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
    );
}
