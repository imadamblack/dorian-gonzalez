'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { info } from '@info';
import useWebinarSchedule from '@/utils/webinarSchedule';
import { WebinarStyles, Reveal, Countdown } from '@/components/webinar/ui';

// Gracias del webinar (/webinar). Paleta igual a index.js
// Primario (dorado) #EFB710 · Hover #D9A30B · Oscuro #14151F · Dorado legible sobre claro #8A6700

// Sin "export": en Next 12 un page que exporta algo además del componente rompe Fast Refresh
// Fecha y hora llegan en la URL desde /webinar (?fecha=YYYY-MM-DD&hora=HH:MM)
const WEBINAR = {
  platform: 'En vivo por Zoom',
  duration: '90 minutos',
};

const content = {
  hero: {
    eyebrow: 'Registro confirmado',
    // Se muestra como: ¡Ya tienes [tu lugar], Nombre!
    titleStart: '¡Ya tienes ',
    titleHl: 'tu lugar',
    progress: { label: 'Registro completado al 50%', hint: 'Último paso: confírmanos por WhatsApp' },
    countdownLabel: 'El webinar empieza en',
    subtitle: 'Te enviaremos el enlace de acceso por WhatsApp',
    description: 'Guarda nuestro número para que el mensaje no se pierda y recibas los recordatorios antes de iniciar.',
  },
  whatsapp: {
    label: 'Confirmar por WhatsApp',
    note: 'Mándanos un mensaje para asegurar que recibas el enlace.',
  },
  ticker: ['Clase gratuita', 'En vivo por Zoom', 'Redes sociales', 'Inteligencia artificial', 'Técnica de ventas', 'Método CREE-SER'],
  pasos: {
    eyebrow: 'Antes del webinar',
    title: 'Tres cosas que hacer ahora',
    items: [
      { icon: 'chat', title: 'Guarda nuestro WhatsApp', text: 'Por ahí te llega el enlace y los recordatorios.' },
      { icon: 'calendar', title: 'Aparta la fecha', text: 'Agéndalo en tu calendario y conéctate 5 minutos antes.' },
      { icon: 'laptop', title: 'Ten a la mano dónde anotar', text: 'Vas a llevarte ideas que puedes aplicar ese mismo día.' },
    ],
  },
  resumen: {
    eyebrow: 'Webinar gratuito · En vivo',
    title: 'Cómo vender más con redes sociales e inteligencia artificial',
    datos: [
      { icon: 'calendar', label: 'Fecha', key: 'date' },
      { icon: 'clock', label: 'Hora', key: 'time' },
      { icon: 'pin', label: 'Dónde', value: WEBINAR.platform },
      { icon: 'tag', label: 'Duración', value: WEBINAR.duration },
    ],
    cupo: 'Quédate hasta el final: beneficio exclusivo para asistentes en vivo',
    back: { label: 'Volver a la página del webinar', href: '/webinar' },
  },
  footer: {
    brand: 'Más Ventas Online',
    copy: '© 2026 Dorian González. All Rights Reserved.',
    disclaimer:
      'Este sitio no forma parte de Meta, Facebook, Instagram ni WhatsApp, ni está afiliado o respaldado por ellos.',
    privacy: 'Aviso de privacidad',
  },
};

const Icon = ({ name, className = 'w-5 h-5' }) => {
  const stroke = { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.8, 'aria-hidden': true, className };
  const icons = {
    check: (
      <svg {...stroke} strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
    arrow: (
      <svg {...stroke} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    ),
    chat: (
      <svg {...stroke} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4.2-1.1L3.5 20.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.5c0 3.3 3.2 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 01-2.8-2.8l.9-1-1-2L9 8.5z" />
      </svg>
    ),
    ticket: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
    laptop: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
    calendar: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    clock: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    pin: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    tag: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    users: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    gift: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    doc: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const CTAButton = ({ children, href, className = '', icon = 'arrow', ...props }) => (
  <a href={href} className={`wb-cta cursor-pointer px-8 py-5 ft-1 ${className}`} {...props}>
    {children}
    <Icon name={icon} className="w-5 h-5" />
  </a>
);

const GridBg = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.08]"
    style={{
      backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    }}
  />
);

const Eyebrow = ({ children, dark = false }) => (
  <span className={`-ft-3 inline-block font-bold tracking-[0.2em] uppercase mb-3 ${dark ? 'text-[#EFB710]' : 'text-[#8A6700]'}`}>
    {children}
  </span>
);

// wa.me solo acepta dígitos
const whatsappHref = () => {
  const phone = String(info.whatsapp?.value || '').replace(/\D/g, '');
  const text = encodeURIComponent('Hola, me registré al webinar gratuito');
  return `https://wa.me/${phone}${text ? `?text=${text}` : ''}`;
};

// Nombre guardado por OptInForm en la cookie "lead"
const useLeadName = () => {
  const [name, setName] = useState('');
  useEffect(() => {
    try {
      const cookie = getCookie('lead');
      const lead = typeof cookie === 'string' ? JSON.parse(cookie) : cookie;
      setName(lead?.fullName?.trim().split(' ')[0] ?? '');
    } catch {
      setName('');
    }
  }, []);
  return name;
};

const Hero = ({ name }) => {
  const { hero, whatsapp } = content;
  return (
    <section className="pt-20 pb-20 px-6 relative overflow-hidden" style={{ backgroundColor: '#14151F' }}>
      <GridBg />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[#EFB710] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[260px] bg-[#E02424] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto max-w-2xl relative z-10 text-center">
        <span className="wb-check w-20 h-20 rounded-full bg-[#EFB710] text-[#14151F] flex items-center justify-center mx-auto mb-6">
          <Icon name="check" className="w-10 h-10" />
        </span>
        <Eyebrow dark>{hero.eyebrow}</Eyebrow>
        <h1 className="ft-8 text-white mb-4 leading-tight">
          {hero.titleStart}
          <span className="wb-hl wb-hl-gold">{hero.titleHl}</span>
          {name ? `, ${name}!` : '!'}
        </h1>
        <p className="ft-2 text-white mb-3">{hero.subtitle}</p>
        <p className="ft-1 text-neutral-300 mb-8">{hero.description}</p>

        <div className="max-w-md mx-auto mb-8 text-left">
          <div className="flex justify-between -ft-2 mb-2">
            <span className="text-white font-bold">{hero.progress.label}</span>
            <span className="text-[#EFB710]">50%</span>
          </div>
          <div className="h-4 rounded-full bg-white/10 overflow-hidden border border-white/10">
            <div className="wb-progress h-full w-1/2 rounded-full" />
          </div>
          <p className="-ft-2 text-neutral-400 mt-2">{hero.progress.hint}</p>
        </div>

        {info.whatsapp?.value && (
          <>
            <CTAButton href={whatsappHref()} target="_blank" rel="noopener noreferrer" icon="chat">
              {whatsapp.label}
            </CTAButton>
            <p className="-ft-2 text-neutral-400 mt-4">{whatsapp.note}</p>
          </>
        )}

        <div className="mt-10">
          <Countdown label={hero.countdownLabel} onDark />
        </div>
      </div>
    </section>
  );
};

const Ticker = () => {
  const items = [...content.ticker, ...content.ticker];
  return (
    <div className="bg-[#EFB710] py-4 overflow-hidden -rotate-1 scale-[1.02] border-y-2 border-[#14151F]" aria-hidden>
      <div className="wb-marquee">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 ft-2 font-black uppercase text-[#14151F] whitespace-nowrap">
            {t}
            <Icon name="check" className="w-5 h-5" />
          </span>
        ))}
      </div>
    </div>
  );
};

const Pasos = () => {
  const { pasos } = content;
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-5xl">
        <Reveal className="text-center mb-12">
          <Eyebrow>{pasos.eyebrow}</Eyebrow>
          <h2 className="text-neutral-900">{pasos.title}</h2>
        </Reveal>
        <ol className="grid md:grid-cols-3 gap-6">
          {pasos.items.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.1}>
              <div className="group h-full p-6 rounded-2xl border-2 border-[#EFB710] bg-neutral-50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#EFB710]/25 hover:bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-xl bg-[#14151F] text-[#EFB710] flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Icon name={p.icon} className="w-6 h-6" />
                  </span>
                  <span className="ft-6 font-black text-[#EFB710]/40">{`0${i + 1}`}</span>
                </div>
                <h3 className="ft-2 text-neutral-900 mb-1">{p.title}</h3>
                <p className="-ft-1 text-neutral-600">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};

const Resumen = () => {
  const { resumen } = content;
  const schedule = useWebinarSchedule();
  return (
    <section className="py-20 px-6 bg-neutral-50">
      <Reveal className="container mx-auto max-w-3xl relative">
        <span className="wb-tape" aria-hidden />
        <div className="wb-ring shadow-2xl shadow-black/20">
        <div className="relative bg-white rounded-[19px] p-6 md:p-10">
        <div className="text-center mb-10">
          <Eyebrow>{resumen.eyebrow}</Eyebrow>
          <h2 className="text-neutral-900">{resumen.title}</h2>
        </div>
        <dl className="grid sm:grid-cols-2 gap-4 mb-8">
          {resumen.datos.map((d) => (
            <div key={d.label} className="flex items-start gap-3 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#EFB710] text-[#14151F] flex items-center justify-center">
                <Icon name={d.icon} className="w-5 h-5" />
              </span>
              <div>
                <dt className="-ft-3 uppercase tracking-[0.2em] text-neutral-500">{d.label}</dt>
                <dd className="ft-0 text-neutral-900">{d.key ? schedule[d.key] : d.value}</dd>
              </div>
            </div>
          ))}
        </dl>
        <p className="flex items-center justify-center gap-3 ft-1 font-bold text-neutral-900 mb-10 p-4 rounded-2xl border-2 border-dashed border-[#EFB710] bg-[#EFB710]/10">
          <span className="wb-note flex-shrink-0 w-10 h-10 rounded-xl bg-[#EFB710] text-[#14151F] flex items-center justify-center">
            <Icon name="gift" className="w-6 h-6" />
          </span>
          {resumen.cupo}
        </p>
        <div className="flex justify-center">
          <a href={`${resumen.back.href}${schedule.qs}`} className="-ft-1 text-neutral-600 underline underline-offset-4 hover:text-[#8A6700]">
            {resumen.back.label}
          </a>
        </div>
        </div>
        </div>
      </Reveal>
    </section>
  );
};

const Footer = () => (
  <footer className="py-10 px-6 border-t border-white/5" style={{ backgroundColor: '#14151F' }}>
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      <div>
        <span className="text-white ft-1">{content.footer.brand}</span>
        <p className="text-neutral-400 -ft-3 mt-1 max-w-xl">{content.footer.disclaimer}</p>
      </div>
      <div className="flex flex-col items-center md:items-end gap-1">
        <a href={info.privacyNotice} className="-ft-3 text-neutral-400 hover:text-white">{content.footer.privacy}</a>
        <p className="text-neutral-400 -ft-3">{content.footer.copy}</p>
      </div>
    </div>
  </footer>
);

export default function WebinarThankYou() {
  const name = useLeadName();
  return (
    <div className="antialiased overflow-x-hidden">
      <WebinarStyles />
      <style jsx global>{`
        .wb-check { animation: wb-ping-gold 1.8s ease-out infinite; }
        @keyframes wb-ping-gold {
          0% { box-shadow: 0 0 0 0 rgba(239, 183, 16, 0.6); }
          80%, 100% { box-shadow: 0 0 0 18px rgba(239, 183, 16, 0); }
        }
        .wb-progress {
          background: repeating-linear-gradient(45deg, #efb710 0 10px, #ffd23f 10px 20px);
          background-size: 28.28px 100%;
          animation: wb-stripes 1s linear infinite;
        }
        @keyframes wb-stripes { to { background-position: 28.28px 0; } }
        @media (prefers-reduced-motion: reduce) {
          .wb-check, .wb-progress { animation: none !important; }
        }
      `}</style>
      <Hero name={name} />
      <Ticker />
      <Pasos />
      <Resumen />
      <Footer />
    </div>
  );
}
