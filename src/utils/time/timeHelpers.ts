import { format, fromUnixTime, isToday, isYesterday, isThisYear } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateFnsLocale';
import type { Locale } from '@/i18n/config';

/**
 * Idioma activo sin acoplar a react-i18next (evita ciclos de importación en utils puras).
 * Usa el mismo localStorage que `detectLanguage` en i18n/config.
 */
function activeLanguage(): Locale {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
  if (saved === 'pt-BR' || saved === 'pt' || saved === 'en' || saved === 'es' || saved === 'fr' || saved === 'it') {
    return saved;
  }
  return 'pt-BR';
}

const TIME_WORDS: Record<Locale, { now: string; yesterday: string; at: string; invalid: string }> = {
  'pt-BR': { now: 'Agora', yesterday: 'Ontem', at: 'às', invalid: 'Data inválida' },
  pt: { now: 'Agora', yesterday: 'Ontem', at: 'às', invalid: 'Data inválida' },
  es: { now: 'Ahora', yesterday: 'Ayer', at: 'a las', invalid: 'Fecha inválida' },
  en: { now: 'Now', yesterday: 'Yesterday', at: 'at', invalid: 'Invalid date' },
  fr: { now: "Maintenant", yesterday: 'Hier', at: 'à', invalid: 'Date invalide' },
  it: { now: 'Ora', yesterday: 'Ieri', at: 'alle', invalid: 'Data non valida' },
};

/** Patrón de fecha larga: "15 de enero de 2025" (pt/es) vs "15 January 2025" (resto). */
function longDatePattern(language: Locale): string {
  return language === 'pt-BR' || language === 'pt' || language === 'es'
    ? "dd 'de' MMMM 'de' yyyy"
    : 'dd MMMM yyyy';
}

/**
 * Normaliza created_at (API/WebSocket) para Unix timestamp em segundos.
 * Evita "21 Jan 1970" quando o backend envia segundos como string (new Date("1739...") interpreta como ms).
 */
export function normalizeToUnixSeconds(
  value: number | string | null | undefined,
): number {
  if (value == null || value === '') {
    return Math.floor(Date.now() / 1000);
  }
  if (typeof value === 'number') {
    if (Number.isNaN(value) || value <= 0) return Math.floor(Date.now() / 1000);
    // Número >= 1e12 é milissegundos; senão segundos
    return value >= 1e12 ? Math.floor(value / 1000) : value;
  }
  const str = String(value).trim();
  if (/^\d+$/.test(str)) {
    const n = parseInt(str, 10);
    if (n <= 0) return Math.floor(Date.now() / 1000);
    return n >= 1e12 ? Math.floor(n / 1000) : n;
  }
  const ms = new Date(value).getTime();
  if (Number.isNaN(ms)) return Math.floor(Date.now() / 1000);
  return Math.floor(ms / 1000);
}

/**
 * Formata um timestamp Unix para exibir horário de forma inteligente
 * Baseado no padrão Evolution, mas com lógica brasileira
 */
export const formatConversationTime = (timestamp: number, language?: Locale): string => {
  const lang = language ?? activeLanguage();
  const locale = getDateFnsLocale(lang);
  const words = TIME_WORDS[lang];
  if (!timestamp || timestamp <= 0) {
    return words.now;
  }

  const date = fromUnixTime(timestamp);
  // const now = new Date();

  // Se é hoje: mostra apenas o horário (14:30)
  if (isToday(date)) {
    return format(date, 'HH:mm', { locale });
  }

  // Se foi ontem: "Ontem" / "Ayer" / "Yesterday" ...
  if (isYesterday(date)) {
    return words.yesterday;
  }

  // Se é deste ano: mostra dia e mês (15 Jan)
  if (isThisYear(date)) {
    return format(date, 'dd MMM', { locale });
  }

  // Se é de outro ano: mostra ano também (15 Jan 2023)
  return format(date, 'dd MMM yyyy', { locale });
};

/**
 * Formata timestamp para tooltip com informações completas
 */
export const formatDetailedTime = (timestamp: number, language?: Locale): string => {
  const lang = language ?? activeLanguage();
  const locale = getDateFnsLocale(lang);
  const words = TIME_WORDS[lang];
  if (!timestamp || timestamp <= 0) {
    return words.invalid;
  }

  const date = fromUnixTime(timestamp);
  return format(date, `${longDatePattern(lang)} '${words.at}' HH:mm`, { locale });
};

/**
 * Formata horário de mensagem (mais específico que conversação)
 * Aceita tanto Unix timestamp quanto string de data
 */
export const formatMessageTime = (timestamp: number | string, language?: Locale): string => {
  const lang = language ?? activeLanguage();
  const locale = getDateFnsLocale(lang);
  const words = TIME_WORDS[lang];
  if (!timestamp) {
    return '';
  }

  let date: Date;

  if (typeof timestamp === 'string') {
    // Se é string, pode ser ISO string ou Unix timestamp em string
    date = new Date(timestamp);

    // Se a data é inválida, tentar como Unix timestamp
    if (isNaN(date.getTime())) {
      const unixTime = parseInt(timestamp, 10);
      if (unixTime > 0) {
        date = fromUnixTime(unixTime);
      } else {
        return words.invalid;
      }
    }
  } else {
    // Se é número, assumir Unix timestamp
    if (timestamp <= 0) {
      return '';
    }
    date = fromUnixTime(timestamp);
  }

  // Se é hoje: apenas horário
  if (isToday(date)) {
    return format(date, 'HH:mm', { locale });
  }

  // Se foi ontem: "Ontem às 14:30" / "Ayer a las 14:30" / "Yesterday at 14:30" ...
  if (isYesterday(date)) {
    return `${words.yesterday} ${words.at} ${format(date, 'HH:mm', { locale })}`;
  }

  // Outros dias: "15 Jan às 14:30"
  if (isThisYear(date)) {
    return `${format(date, 'dd MMM', { locale })} ${words.at} ${format(date, 'HH:mm', {
      locale,
    })}`;
  }

  // Outros anos: "15 Jan 2023 às 14:30"
  return `${format(date, 'dd MMM yyyy', { locale })} ${words.at} ${format(date, 'HH:mm', {
    locale,
  })}`;
};
