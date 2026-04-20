const styles: Record<string, string> = {
  agendado: 'bg-amber-100 text-amber-900',
  confirmado: 'bg-emerald-100 text-emerald-900',
  cancelado: 'bg-rose-100 text-rose-900',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-800'}`}
    >
      {status}
    </span>
  );
}
