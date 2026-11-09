const dois = (n: number) => String(n).padStart(2, '0');

export function formatarData(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatarHora(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

export function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return `${formatarData(iso)} ${formatarHora(iso)}`;
}

export function formatarValor(centavos: number | null): string {
  if (centavos == null) return 'A definir';
  const [inteiro, decimal] = (centavos / 100).toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimal}`;
}
