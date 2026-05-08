import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
    message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <div className="surface border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100">
            <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-red-600 dark:text-red-400" />
                <div>
                    <p className="text-sm font-semibold">Unable to decrypt</p>
                    <p className="mt-1 text-sm leading-6 opacity-90">{message}</p>
                </div>
            </div>
        </div>
    );
}
