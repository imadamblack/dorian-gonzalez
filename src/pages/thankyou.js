'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { info } from '@info';

const ASSETS = '/gdl';

// Paleta igual a index.js
// Primario (dorado) #EFB710 · Hover #D9A30B · Oscuro #14151F · Dorado legible sobre claro #8A6700

// Sin "export": en Next 12 un page que exporta algo además del componente rompe Fast Refresh
const content = {
  hero: {
    eyebrow: 'Registro recibido',
    title: '¡Gracias!',
    titleWithName: (name) => `¡Gracias, ${name}!`,
    subtitle: 'Nuestro equipo te contactará por WhatsApp',
    description:
      'Resolveremos cualquier duda que tengas y te daremos seguimiento para iniciar con tu proceso de inscripción.',
  },
  whatsapp: {
    label: 'Escríbenos por WhatsApp',
    note: 'Si prefieres no esperar, mándanos mensaje y te atendemos.',
  },
  pasos: {
    eyebrow: 'Lo que sigue',
    items: [
      { icon: 'chat', title: 'Te escribimos por WhatsApp', text: 'Un asesor te contacta para resolver tus dudas.' },
      { icon: 'ticket', title: 'Aparta tu lugar', text: 'Inscríbete con 600 y liquida el primer día de curso.' },
      { icon: 'laptop', title: 'Llega con tu lap top', text: 'Es un curso 100% práctico. Si no tienes, podemos prestarte una.' },
    ],
  },
  resumen: {
    eyebrow: 'Curso presencial Guadalajara',
    title: 'Curso de redes sociales, inteligencia artificial y técnica de ventas',
    datos: [
      { icon: 'calendar', label: 'Fechas', value: 'Sábado 22 y Domingo 23 de Agosto' },
      { icon: 'clock', label: 'Horario', value: '9:00AM a 3:00PM ambos días' },
      { icon: 'pin', label: 'Sede', value: 'IIDEA BUSINESS CENTER · Av. Adolfo López Mateos Sur 4321, La Calma, Zapopan, Jal.' },
      { icon: 'tag', label: 'Inversión', value: '$2,600.00 x persona' },
    ],
    cupo: 'Cupo limitado a solo 20 Personas',
    temario: { label: 'TEMARIO COMPLETO', href: `${ASSETS}/Temario-completo.pdf` },
    back: { label: 'Volver a la página del curso', href: '/' },
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
    doc: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const CTAButton = ({ children, variant = 'primary', href, className = '', icon = 'arrow', ...props }) => {
  const styles =
    variant === 'primary'
      ? 'bg-[#EFB710] hover:bg-[#D9A30B] text-[#14151F] shadow-lg shadow-[#EFB710]/25'
      : 'bg-[#14151F] hover:bg-black text-white';
  return (
    <a
      href={href}
      className={`cursor-pointer inline-flex items-center gap-2 font-bold rounded-xl px-7 py-4 ft-1 transition-all duration-200 ${styles} ${className}`}
      {...props}
    >
      {children}
      <Icon name={icon} className="w-4 h-4" />
    </a>
  );
};

const Eyebrow = ({ children, dark = false }) => (
  <span className={`-ft-3 inline-block font-bold tracking-[0.2em] uppercase mb-3 ${dark ? 'text-[#EFB710]' : 'text-[#8A6700]'}`}>
    {children}
  </span>
);

// wa.me solo acepta dígitos
const whatsappHref = () => {
  const phone = String(info.whatsapp?.value || '').replace(/\D/g, '');
  const text = encodeURIComponent(info.whatsapp?.message || '');
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
    <section className="pt-20 pb-16 px-6 relative overflow-hidden" style={{ backgroundColor: '#14151F' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#EFB710] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto max-w-2xl relative z-10 text-center">
        <span className="w-16 h-16 rounded-full bg-[#EFB710] text-[#14151F] flex items-center justify-center mx-auto mb-6">
          <Icon name="check" className="w-8 h-8" />
        </span>
        <Eyebrow dark>{hero.eyebrow}</Eyebrow>
        <h1 className="ft-8 text-white mb-4">{name ? hero.titleWithName(name) : hero.title}</h1>
        <p className="ft-2 text-white mb-3">{hero.subtitle}</p>
        <p className="ft-1 text-neutral-300 mb-10">{hero.description}</p>
        {info.whatsapp?.value && (
          <>
            <CTAButton href={whatsappHref()} target="_blank" rel="noopener noreferrer" icon="chat">
              {whatsapp.label}
            </CTAButton>
            <p className="-ft-2 text-neutral-400 mt-4">{whatsapp.note}</p>
          </>
        )}
      </div>
    </section>
  );
};

const Pasos = () => {
  const { pasos } = content;
  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <Eyebrow>{pasos.eyebrow}</Eyebrow>
        </div>
        <ol className="grid md:grid-cols-3 gap-6">
          {pasos.items.map((p, i) => (
            <li key={p.title} className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-[#14151F] text-[#EFB710] flex items-center justify-center">
                  <Icon name={p.icon} className="w-5 h-5" />
                </span>
                <span className="-ft-2 text-[#8A6700]">{`0${i + 1}`}</span>
              </div>
              <h3 className="ft-2 text-neutral-900 mb-1">{p.title}</h3>
              <p className="-ft-1 text-neutral-600">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

const Resumen = () => {
  const { resumen } = content;
  return (
    <section className="py-16 px-6 bg-neutral-50">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <Eyebrow>{resumen.eyebrow}</Eyebrow>
          <h2 className="text-neutral-900">{resumen.title}</h2>
        </div>
        <dl className="grid sm:grid-cols-2 gap-4 mb-8">
          {resumen.datos.map((d) => (
            <div key={d.label} className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-neutral-200">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#EFB710]/20 text-[#8A6700] flex items-center justify-center">
                <Icon name={d.icon} className="w-5 h-5" />
              </span>
              <div>
                <dt className="-ft-3 uppercase tracking-[0.2em] text-neutral-500">{d.label}</dt>
                <dd className="ft-0 text-neutral-900">{d.value}</dd>
              </div>
            </div>
          ))}
        </dl>
        <p className="flex items-center justify-center gap-2 ft-1 text-neutral-900 mb-10">
          <Icon name="users" className="w-6 h-6 text-[#8A6700]" />
          {resumen.cupo}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTAButton href={resumen.temario.href} target="_blank" rel="noopener" icon="doc">
            {resumen.temario.label}
          </CTAButton>
          <a href={resumen.back.href} className="-ft-1 text-neutral-600 underline underline-offset-4 hover:text-[#8A6700]">
            {resumen.back.label}
          </a>
        </div>
      </div>
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

export default function ThankYou() {
  const name = useLeadName();
  return (
    <div className="antialiased">
      <Hero name={name} />
      <Pasos />
      <Resumen />
      <Footer />
    </div>
  );
}
