/** Máscara DD/MM/AAAA enquanto digita */
export function formatarDataDigitando(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Máscara HH:MM enquanto digita */
export function formatarHoraDigitando(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}:${d.slice(2)}`;
}

/** Converte "15/07/2026" + "10:30" em Date. Devolve null se a data não existir (ex.: 31/02). */
export function montarDataHora(data: string, hora: string): Date | null {
  const d = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
  const h = /^(\d{2}):(\d{2})$/.exec(hora);
  if (!d || !h) return null;

  const [dia, mes, ano, hh, mm] = [+d[1], +d[2], +d[3], +h[1], +h[2]];
  const dt = new Date(ano, mes - 1, dia, hh, mm);
  const confere =
    dt.getFullYear() === ano &&
    dt.getMonth() === mes - 1 &&
    dt.getDate() === dia &&
    dt.getHours() === hh &&
    dt.getMinutes() === mm;
  return confere ? dt : null;
}

export function validarData(data: string): string {
  if (!data) return 'Informe a data.';
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return 'Use o formato DD/MM/AAAA.';
  if (!montarDataHora(data, '12:00')) return 'Essa data não existe.';
  return '';
}

export function validarHora(hora: string): string {
  if (!hora) return 'Informe o horário.';
  if (!/^\d{2}:\d{2}$/.test(hora)) return 'Use o formato HH:MM.';
  if (!montarDataHora('01/01/2030', hora)) return 'Horário inválido.';
  return '';
}

/** Data e hora precisam estar no futuro e dentro de 1 ano */
export function validarFuturo(data: string, hora: string): string {
  const dt = montarDataHora(data, hora);
  if (!dt) return '';
  const agora = Date.now();
  if (dt.getTime() <= agora) return 'Escolha uma data e um horário no futuro.';
  if (dt.getTime() > agora + 365 * 24 * 60 * 60 * 1000) return 'Escolha uma data dentro de 1 ano.';
  return '';
}
