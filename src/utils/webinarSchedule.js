import { useEffect, useState } from 'react';

/*
  Fecha y hora del webinar desde parámetros de URL:
    /webinar?fecha=2026-12-03&hora=20:00
  - fecha: YYYY-MM-DD  → "Jueves 3 de diciembre"
  - hora:  HH:MM (24h) → "8:00 PM (hora del centro de México)"
  Si el valor no tiene ese formato se muestra tal cual (ej. ?fecha=Jueves 3 de diciembre).
  Sin parámetro se usa el texto de respaldo.
*/

const TZ_LABEL = '(hora del centro de México)';
const FALLBACK = { date: 'Fecha por anunciar', time: 'Hora por anunciar' };

const clean = (v) => (Array.isArray(v) ? v[0] : v || '').toString().trim().slice(0, 60);

export const formatFecha = (raw) => {
  const v = clean(raw);
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return v;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return v;
  const txt = d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '');
  return txt.charAt(0).toUpperCase() + txt.slice(1);
};

export const formatHora = (raw) => {
  const v = clean(raw);
  const m = v.match(/^(\d{1,2}):(\d{2})$/);
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return v;
  const h = Number(m[1]);
  const h12 = h % 12 || 12;
  return `${h12}:${m[2]} ${h < 12 ? 'AM' : 'PM'} ${TZ_LABEL}`;
};

export default function useWebinarSchedule() {
  // La página es estática: los parámetros solo existen en el navegador.
  // Hasta leerlos se muestra un espacio en blanco (evita el parpadeo del texto de respaldo).
  const [params, setParams] = useState(null);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setParams({ fecha: clean(sp.get('fecha')), hora: clean(sp.get('hora')) });
  }, []);

  if (!params) return { date: '\u00a0', time: '\u00a0', qs: '', target: null };

  const date = formatFecha(params.fecha) || FALLBACK.date;
  const time = formatHora(params.hora) || FALLBACK.time;
  // Query string para conservar fecha/hora al pasar a la página de gracias
  const out = new URLSearchParams();
  if (params.fecha) out.set('fecha', params.fecha);
  if (params.hora) out.set('hora', params.hora);
  const qs = out.toString();
  return { date, time, qs: qs ? `?${qs}` : '', target: getTarget(params.fecha, params.hora) };
}

// Timestamp (ms) del inicio del webinar en hora del centro de México (UTC-6, sin horario de verano desde 2022)
export const getTarget = (fecha, hora) => {
  const d = (fecha || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const t = (hora || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!d || !t) return null;
  return Date.UTC(Number(d[1]), Number(d[2]) - 1, Number(d[3]), Number(t[1]) + 6, Number(t[2]));
};
