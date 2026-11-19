import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import useWebinarSchedule from '@/utils/webinarSchedule';

// ─── Piezas compartidas por /webinar y /webinar-gracias ───────────────────────
// Estilos dinámicos: CTA .wb-cta (degradado, brillo, pulso), chips .wb-hl, borde giratorio .wb-ring,
// cinta .wb-tape, notas .wb-note, marquesina .wb-marquee y punto en vivo .wb-live.
// Todas las animaciones se apagan con prefers-reduced-motion.

export const WebinarStyles = () => (
  <style jsx global>{`
    /* CTA dorado: degradado vertical, borde claro, brillo interior, glow y pulso */
    .wb-cta {
      position: relative;
      overflow: hidden;
      isolation: isolate;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: linear-gradient(180deg, #ffd23f 0%, #efb710 55%, #d99a00 100%) !important;
      color: #14151f !important;
      border: 2px solid #ffe07a !important;
      border-radius: 14px !important;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 10px 26px rgba(239, 183, 16, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.55);
      animation: wb-pulse 2s ease-in-out infinite;
      transition: transform 0.18s, box-shadow 0.18s, filter 0.18s;
    }
    .wb-cta::after {
      content: '';
      position: absolute;
      top: -20%;
      bottom: -20%;
      left: -60%;
      width: 40%;
      z-index: -1;
      background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.75), transparent);
      transform: skewX(-20deg);
      animation: wb-sweep 3.2s ease-in-out infinite;
    }
    .wb-cta:hover {
      animation-play-state: paused;
      transform: translateY(-2px) scale(1.03);
      filter: brightness(1.05);
      box-shadow: 0 16px 44px rgba(239, 183, 16, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.55);
    }
    .wb-cta:active {
      transform: translateY(1px) scale(0.99);
    }
    .wb-cta-dark {
      background: linear-gradient(180deg, #2a2c3d 0%, #14151f 100%) !important;
      color: #fff !important;
      border-color: #3a3d55 !important;
      box-shadow: 0 10px 26px rgba(20, 21, 31, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15);
      animation-name: wb-pulse-dark;
    }
    .wb-cta-dark::after {
      background: linear-gradient(100deg, transparent, rgba(239, 183, 16, 0.45), transparent);
    }
    @keyframes wb-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 10px 26px rgba(239, 183, 16, 0.4), 0 0 0 0 rgba(239, 183, 16, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.55); }
      50% { transform: scale(1.035); box-shadow: 0 14px 40px rgba(239, 183, 16, 0.65), 0 0 0 10px rgba(239, 183, 16, 0), inset 0 1px 0 rgba(255, 255, 255, 0.55); }
    }
    @keyframes wb-pulse-dark {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.035); }
    }
    @keyframes wb-sweep {
      0% { left: -60%; }
      55%, 100% { left: 130%; }
    }

    /* Chips del titular */
    .wb-hl {
      display: inline-block;
      padding: 0 0.3em;
      margin: 0.06em 0;
      border-radius: 0.18em;
      line-height: 1.15;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
    .wb-hl-gold { background: #efb710; color: #14151f; transform: rotate(-1.2deg); box-shadow: 0 6px 0 #a87a00; }
    .wb-hl-red { background: #e02424; color: #fff; transform: rotate(1deg); box-shadow: 0 6px 0 #8e1414; }

    /* Tarjeta de registro con borde giratorio */
    .wb-ring {
      position: relative;
      border-radius: 22px;
      padding: 3px;
      overflow: hidden;
      isolation: isolate;
    }
    .wb-ring::before {
      content: '';
      position: absolute;
      inset: -50%;
      z-index: -1;
      background: conic-gradient(from 0deg, #efb710, #e02424, #ffe07a, #efb710, #14151f, #efb710);
      animation: wb-spin 5s linear infinite;
    }
    @keyframes wb-spin { to { transform: rotate(360deg); } }

    /* Cinta adhesiva y notas flotantes */
    .wb-tape {
      position: absolute;
      top: -12px;
      left: 50%;
      width: 96px;
      height: 24px;
      transform: translateX(-50%) rotate(-3deg);
      background: rgba(255, 240, 190, 0.85);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      z-index: 2;
    }
    .wb-note {
      --rot: -6deg;
      animation: wb-bob 4s ease-in-out infinite;
    }
    .wb-note-right { --rot: 5deg; animation-delay: -2s; }
    @keyframes wb-bob {
      0%, 100% { transform: rotate(var(--rot)) translateY(0); }
      50% { transform: rotate(var(--rot)) translateY(-9px); }
    }

    /* Cinta de texto en movimiento */
    .wb-marquee { display: flex; width: max-content; animation: wb-run 28s linear infinite; }
    @keyframes wb-run { to { transform: translateX(-50%); } }

    /* Punto "en vivo" */
    .wb-live::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #ff3b3b;
      margin-right: 6px;
      animation: wb-ping 1.4s ease-out infinite;
    }
    @keyframes wb-ping {
      0% { box-shadow: 0 0 0 0 rgba(255, 59, 59, 0.7); }
      80%, 100% { box-shadow: 0 0 0 8px rgba(255, 59, 59, 0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .wb-cta, .wb-cta::after, .wb-ring::before, .wb-note, .wb-marquee, .wb-live::before {
        animation: none !important;
      }
    }
  `}</style>
);

// Aparece al entrar en pantalla (se desactiva con prefers-reduced-motion)
export const Reveal = ({ children, delay = 0, className = '', as = 'div' }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </Tag>
  );
};

// Cuenta regresiva (solo si fecha y hora vienen en formato válido y aún no empieza)
export const Countdown = ({ label = 'El webinar empieza en', onDark = false }) => {
  const { target } = useWebinarSchedule();
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!target || !now || target <= now) return null;

  const s = Math.floor((target - now) / 1000);
  const parts = [
    { v: Math.floor(s / 86400), u: 'días' },
    { v: Math.floor((s % 86400) / 3600), u: 'hrs' },
    { v: Math.floor((s % 3600) / 60), u: 'min' },
    { v: s % 60, u: 'seg' },
  ];
  return (
    <div className="mt-5 text-center">
      <p className={`-ft-3 uppercase tracking-[0.2em] mb-2 ${onDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{label}</p>
      <div className="flex justify-center gap-2" aria-live="off">
        {parts.map((p) => (
          <div key={p.u} className={`w-16 py-2 rounded-xl text-white ${onDark ? 'bg-white/10 border border-white/15' : 'bg-[#14151F]'}`}>
            <span className="block ft-4 font-black tabular-nums leading-none">{String(p.v).padStart(2, '0')}</span>
            <span className="block -ft-3 uppercase text-[#EFB710] mt-1">{p.u}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

