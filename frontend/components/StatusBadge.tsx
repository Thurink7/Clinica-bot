const styles: Record<string, string> = {
  agendado: 'bg-slate-100 text-slate-800 ring-1 ring-slate-200',
  confirmado: 'bg-brand-light text-brand-secondary ring-1 ring-brand-primary/25',
  cancelado: 'bg-red-50 text-red-800 ring-1 ring-red-200',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] || 'bg-slate-100 text-slate-800'}`}
    >
      {status}
    </span>
  );
}
