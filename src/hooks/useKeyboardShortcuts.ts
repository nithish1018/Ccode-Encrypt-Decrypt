import { useEffect } from 'react';

interface UseKeyboardShortcutsOptions {
    onSubmit: () => void;
    onClear: () => void;
    onSwitchMode: (mode: 'encrypt' | 'decrypt') => void;
    activeMode: 'encrypt' | 'decrypt';
}

export function useKeyboardShortcuts({ onSubmit, onClear, onSwitchMode, activeMode }: UseKeyboardShortcutsOptions) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isModifier = event.metaKey || event.ctrlKey;

            if (isModifier && event.key === 'Enter') {
                event.preventDefault();
                onSubmit();
                return;
            }

            if (event.key === 'Escape') {
                onClear();
                return;
            }

            if (event.altKey && event.key.toLowerCase() === 'e') {
                onSwitchMode('encrypt');
            }

            if (event.altKey && event.key.toLowerCase() === 'd') {
                onSwitchMode('decrypt');
            }

            if (event.altKey && event.key === 'ArrowLeft') {
                onSwitchMode(activeMode === 'encrypt' ? 'decrypt' : 'encrypt');
            }

            if (event.altKey && event.key === 'ArrowRight') {
                onSwitchMode(activeMode === 'encrypt' ? 'decrypt' : 'encrypt');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeMode, onClear, onSubmit, onSwitchMode]);
}
