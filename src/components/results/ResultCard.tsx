import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface ResultCardProps {
  title: string;
  description: string;
  value: string;
  emptyState: ReactNode;
  actions?: ReactNode;
  secureContent?: ReactNode;
  highlighted?: boolean;
}

export function ResultCard({
  title,
  description,
  value,
  emptyState,
  actions,
  secureContent,
  highlighted = false,
}: ResultCardProps) {
  const [copiedSelection, setCopiedSelection] = useState(false);

  const handleSelect = async () => {
    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopiedSelection(true);
    window.setTimeout(() => setCopiedSelection(false), 1400);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`surface p-6 sm:p-8 ${highlighted
          ? 'border border-emerald-200 ring-2 ring-emerald-500/20 shadow-[0_18px_50px_-28px_rgba(16,185,129,0.45)] dark:border-emerald-900/60 dark:ring-emerald-400/15'
          : ''
        }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            {highlighted ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
                Result
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>

      <div className="mt-5">
        {secureContent ? (
          <div className="space-y-4">{secureContent}</div>
        ) : value ? (
          <button
            type="button"
            onClick={handleSelect}
            className="w-full rounded-xl border border-dashed border-emerald-300 bg-emerald-50 p-4 text-left transition hover:border-emerald-400 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/35"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Click to copy and select
              </p>
              <p className={`text-xs font-semibold ${copiedSelection ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {copiedSelection ? 'Copied' : 'Selectable'}
              </p>
            </div>
            <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap break-all text-sm leading-6 text-slate-800 dark:text-slate-200">
              {value}
            </pre>
          </button>
        ) : (
          emptyState
        )}
      </div>
    </motion.section>
  );
}
