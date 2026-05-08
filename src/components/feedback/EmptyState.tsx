import { ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                <ShieldAlert className="h-5 w-5" />
            </div>
            <h4 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    );
}
