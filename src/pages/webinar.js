'use client';

import Image from 'next/image';
import Script from 'next/script';
import OptInForm from './../components/form/opt-in-form';
import useWebinarSchedule from '@/utils/webinarSchedule';
import { WebinarStyles, Reveal, Countdown } from '@/components/webinar/ui';

/*
  Versión alternativa de la landing: la oferta es un WEBINAR GRATUITO introductorio.
  Aquí NO se vende el curso presencial (sin precio, sede, fechas del curso ni certificado).
  El curso se presenta dentro del webinar: es su conversión.

  Fecha y hora vienen de la URL: /webinar?fecha=2026-12-03&hora=20:00 (ver src/utils/webinarSchedule.js).

  Estilo dinámico (ver src/components/webinar/ui.js):
  - CTA dorado con degradado, brillo que lo recorre y pulso
  - Barra superior fija con fecha y hora
  - Palabras clave del titular en "chips" ligeramente rotados
  - Tarjeta de registro con borde animado, cinta y cuenta regresiva
  - Notas flotantes, cinta de texto en movimiento y secciones que aparecen al hacer scroll
  Todas las animaciones se desactivan con prefers-reduced-motion.
*/

const ASSETS = '/gdl';
const PIXEL_ID = '1607715167316214';

const WEBINAR = {
  platform: 'En vivo por Zoom',
};

// Paleta: Primario (dorado) #EFB710 · Hover #D9A30B · Acento rojo #E02424 · Oscuro #14151F · Dorado legible sobre claro #8A6700

// Sin "export": en Next 12 un page que exporta algo además del componente rompe Fast Refresh (loop de recargas)
const content = {
  topbar: {
    live: 'En vivo',
    cta: 'REGISTRARME GRATIS',
  },
  hero: {
    proof: '+7,000 emprendedores ya aprendieron con Dorian',
    // Las partes con hl se muestran como chips resaltados
    title: [
      { text: 'Cómo ' },
      { text: 'vender más', hl: 'gold' },
      { text: ' con ' },
      { text: 'redes sociales', hl: 'red' },
      { text: ' e ' },
      { text: 'inteligencia artificial', hl: 'gold' },
    ],
    tagline: 'Aunque no seas experto en tecnología ni tengas seguidores. Clase gratuita, en vivo y 100% enfocada en ventas.',
    platforms: [
      { icon: 'facebook', label: 'Facebook' },
      { icon: 'instagram', label: 'Instagram' },
      { icon: 'whatsapp', label: 'WhatsApp' },
      { icon: 'tiktok', label: 'TikTok' },
      { icon: 'sparkles', label: 'ChatGPT' },
    ],
    notes: [
      { tag: 'Incluye', text: 'Método CREE-SER', pos: 'left' },
      { tag: 'Ideal si', text: 'Empiezas desde 0', pos: 'right' },
    ],
  },
  registro: {
    header: 'Regístrate gratis aquí',
    subtitle: 'Te enviamos el enlace de acceso por WhatsApp',
    submit: 'QUIERO MI LUGAR GRATIS',
    countdownLabel: 'El webinar empieza en',
    note: 'Lugares limitados en la sala en vivo',
  },
  ticker: [
    'Redes sociales que venden',
    'Inteligencia artificial',
    'Técnica de ventas',
    'WhatsApp',
    'Método CREE-SER',
    'Desde 0',
    'Clase en vivo',
  ],
  aprenderas: {
    eyebrow: 'En este webinar',
    title: 'Lo que vas a aprender',
    items: [
      {
        icon: 'chart',
        title: 'Por qué tus redes no te están vendiendo',
        text: 'Los errores más comunes que hacen que publiques y publiques sin que lleguen clientes.',
      },
      {
        icon: 'sparkles',
        title: 'Inteligencia artificial para vender, no para jugar',
        text: 'Cómo usar ChatGPT para crear contenido, responder mensajes y cerrar ventas en minutos.',
      },
      {
        icon: 'whatsapp',
        title: 'De mensaje a venta en WhatsApp',
        text: 'La técnica de ventas para convertir conversaciones en clientes que sí pagan.',
      },
      {
        icon: 'whirl',
        title: 'Introducción al método CREE-SER',
        text: 'El sistema paso a paso que usamos para atraer, convencer y vender en redes sociales.',
      },
    ],
    cta: 'QUIERO RESERVAR MI LUGAR',
  },
  paraQuien: {
    eyebrow: 'Partimos completamente desde 0',
    title: '¿Es para mí?',
    si: [
      'Tienes un negocio, producto o servicio y quieres más clientes',
      'Sientes que las redes sociales te quitan tiempo y no te dan ventas',
      'Has escuchado de la inteligencia artificial pero no sabes por dónde empezar',
    ],
    no: [
      'No necesitas experiencia en marketing',
      'No necesitas ser experto en tecnología',
      'No necesitas seguidores',
    ],
    cta: 'REGISTRARME GRATIS',
  },
  metodo: {
    badge: 'Nuevo método',
    title: 'CREE-SER',
    text: 'En el webinar conocerás el método que ha ayudado a miles de emprendedores a vender en redes sociales sin depender de la suerte ni del algoritmo.',
    points: ['Sin tener que ser experto en tecnología', 'Sin tener que tener miles de seguidores'],
    cta: 'REGISTRARME GRATIS',
  },
  bonus: {
    eyebrow: 'Solo para asistentes en vivo',
    title: 'Quédate hasta el final',
    text: 'Al cierre del webinar compartiremos un beneficio exclusivo para quienes estén conectados en vivo. No estará disponible en la repetición.',
  },
  experto: {
    eyebrow: 'Tu',
    highlight: 'anfitrión',
    name: 'DORIAN GONZÁLEZ',
    bullets: [
      'Experto en Marketing Digital y Neuroventas desde hace 13 años',
      'Fundador de Academia Impulso Digital',
      'Creador de Agencia Impulso',
      'Mentor de más de 7,000 emprendedores nacionales e internacionales',
      'Asesor y coach de empresas Transnacionales',
    ],
    image: { src: `${ASSETS}/dorian-gonzalez.png`, w: 428, h: 530, alt: 'Dorian González' },
  },
  galeria: {
    eyebrow: 'Más Ventas Online',
    title: 'Emprendedores que ya aprendieron con Dorian',
    images: [70, 67, 68, 66, 69, 71].map((n, i) => ({
      src: `${ASSETS}/curso-anterior-${n}.jpg`,
      w: 768,
      h: 768,
      alt: `Grupo de emprendedores de Más Ventas Online, foto ${i + 1}`,
    })),
  },
  cierre: {
    title: 'Tu próximo cliente ya está en redes sociales',
    text: 'Aprende a encontrarlo en una clase gratuita y en vivo.',
    cta: 'QUIERO MI LUGAR GRATIS',
  },
  footer: {
    brand: 'Más Ventas Online',
    copy: '© 2026 Dorian González. All Rights Reserved.',
    disclaimer:
      'Este sitio no forma parte de Meta, Facebook, Instagram ni WhatsApp, ni está afiliado o respaldado por ellos.',
  },
};

const Icon = ({ name, className = 'w-5 h-5' }) => {
  const stroke = { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.8, 'aria-hidden': true, className };
  const solid = { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, className };
  const icons = {
    arrow: (
      <svg {...stroke} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    ),
    check: (
      <svg {...stroke} strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
    x: (
      <svg {...stroke} strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
    video: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    chart: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    gift: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    whirl: (
      <svg {...stroke} strokeWidth={1.6}>
        <path strokeLinecap="round" d="M3 4.5h18M5 8h14M7 11.5h10M9 15h6M10.5 18.5h3M11.5 21.5h1" />
      </svg>
    ),
    facebook: (
      <svg {...solid}>
        <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0014.3 4.3c-2.3 0-3.8 1.4-3.8 3.95v2.25H8v3h2.5V21h3z" />
      </svg>
    ),
    instagram: (
      <svg {...stroke} strokeWidth={2}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.25" cy="6.75" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
    whatsapp: (
      <svg {...stroke} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4.2-1.1L3.5 20.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.5c0 3.3 3.2 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 01-2.8-2.8l.9-1-1-2L9 8.5z" />
      </svg>
    ),
    tiktok: (
      <svg {...solid}>
        <path d="M16.6 3h-3.1v12.2a2.7 2.7 0 11-2.7-2.7c.27 0 .53.04.78.11V9.45a5.85 5.85 0 105.02 5.79V9.1A7.4 7.4 0 0021 10.5V7.4A4.5 4.5 0 0116.6 3z" />
      </svg>
    ),
    sparkles: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const CTAButton = ({ children, size = 'md', dark = false, href = '#registro', className = '', ...props }) => {
  const sizing = size === 'sm' ? 'px-4 py-2 -ft-2 whitespace-nowrap' : 'px-8 py-5 ft-1';
  return (
    <a href={href} className={`wb-cta ${dark ? 'wb-cta-dark' : ''} cursor-pointer ${sizing} ${className}`} {...props}>
      {children}
      <Icon name="arrow" className="w-4 h-4" />
    </a>
  );
};

const Eyebrow = ({ children, dark = false }) => (
  <span className={`-ft-3 inline-block font-bold tracking-[0.2em] uppercase mb-3 ${dark ? 'text-[#EFB710]' : 'text-[#8A6700]'}`}>
    {children}
  </span>
);

const Img = ({ img, sizes = '(min-width: 1024px) 768px, 100vw', className = '', priority = false }) => (
  <div className={`overflow-hidden ${className}`}>
    <Image src={img.src} width={img.w} height={img.h} alt={img.alt} sizes={sizes} priority={priority} layout="responsive" lazyBoundary="600px" />
  </div>
);

const GridBg = ({ opacity = 'opacity-[0.06]' }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${opacity}`}
    style={{
      backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    }}
  />
);

const MetaPixel = () => (
  <>
    <Script id="meta-pixel" strategy="lazyOnload">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');fbq('track','ViewContent');`}
    </Script>
    <noscript>
      <img height="1" width="1" className="hidden" alt="" src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} />
    </noscript>
  </>
);

// Barra superior fija: fecha y hora siempre visibles
const TopBar = () => {
  const { date, time } = useWebinarSchedule();
  const { topbar } = content;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#14151F]/90 backdrop-blur-md border-b border-[#EFB710]/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 -ft-2 text-white min-w-0">
          <span className="wb-live inline-flex items-center font-bold uppercase tracking-widest text-[#FF6B6B]">{topbar.live}</span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" className="w-4 h-4 text-[#EFB710]" />
            {date}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <Icon name="clock" className="w-4 h-4 text-[#EFB710]" />
            {time}
          </span>
        </div>
        <span className="hidden sm:block">
          <CTAButton size="sm">{topbar.cta}</CTAButton>
        </span>
      </div>
    </nav>
  );
};

// Formulario en el hero; todos los CTA hacen scroll a #registro
const Registro = () => {
  const { registro, hero } = content;
  const { qs } = useWebinarSchedule();
  return (
    <div className="relative">
      {hero.notes.map((n) => (
        <div
          key={n.text}
          className={`wb-note ${n.pos === 'right' ? 'wb-note-right -right-6 -top-6' : '-left-10 bottom-24'} hidden xl:block absolute z-20 w-36 p-3 bg-[#FFF6D6] text-[#14151F] rounded-md shadow-xl`}
        >
          <span className="block -ft-3 uppercase tracking-widest text-[#8A6700] font-bold">{n.tag}</span>
          <span className="block ft-0 font-bold italic leading-tight">{n.text}</span>
        </div>
      ))}

      <div className="wb-ring shadow-2xl shadow-black/50">
        <div id="registro" className="relative bg-white rounded-[19px] overflow-hidden scroll-mt-28 text-left">
          <div className="relative bg-gradient-to-b from-[#FFD23F] to-[#EFB710] px-6 pt-6 pb-4 text-center">
            <span className="wb-tape" aria-hidden />
            <h2 className="ft-3 uppercase font-black tracking-wide text-[#14151F]">{registro.header}</h2>
            <p className="-ft-1 text-[#14151F]/80">{registro.subtitle}</p>
          </div>
          <div className="p-6 md:p-8">
            <OptInForm
              submitLabel={registro.submit}
              submitClassName="wb-cta !w-full !py-5 ft-1"
              origin="Webinar"
              redirect={`/webinar-gracias${qs}`}
            />
            <Countdown label={content.registro.countdownLabel} />
            <p className="-ft-2 text-center text-[#E02424] font-bold mt-4">{registro.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const { hero } = content;
  const { date, time } = useWebinarSchedule();
  const datos = [
    { icon: 'calendar', value: date },
    { icon: 'clock', value: time },
    { icon: 'video', value: WEBINAR.platform },
  ];
  const avatars = content.galeria.images.slice(0, 4);
  return (
    <section className="pt-28 pb-20 px-6 relative overflow-hidden" style={{ backgroundColor: '#14151F' }}>
      <GridBg opacity="opacity-[0.08]" />
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[800px] h-[400px] bg-[#EFB710] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#E02424] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto relative z-10 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/15 rounded-full pl-1.5 pr-4 py-1.5 mb-6">
              <span className="flex -space-x-2">
                {avatars.map((a) => (
                  <span key={a.src} className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#14151F]">
                    <Image src={a.src} alt="" layout="fill" objectFit="cover" sizes="32px" />
                  </span>
                ))}
              </span>
              <span className="-ft-2 text-white font-bold">{hero.proof}</span>
            </div>
            <h1 className="ft-9 text-white mb-6 leading-tight">
              {hero.title.map((t) =>
                t.hl ? (
                  <span key={t.text} className={`wb-hl wb-hl-${t.hl}`}>{t.text}</span>
                ) : (
                  <span key={t.text}>{t.text}</span>
                ),
              )}
            </h1>
            <p className="ft-2 text-neutral-300 mb-8 max-w-2xl mx-auto lg:mx-0">{hero.tagline}</p>
            <ul className="flex flex-col gap-3 mb-8 items-center lg:items-start">
              {datos.map((d) => (
                <li key={d.icon} className="inline-flex items-center gap-3 ft-1 text-white text-left">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#EFB710] text-[#14151F] flex items-center justify-center">
                    <Icon name={d.icon} className="w-5 h-5" />
                  </span>
                  <span>{d.value}</span>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-2 justify-center lg:justify-start" aria-label="Plataformas">
              {hero.platforms.map((p) => (
                <li key={p.label} className="inline-flex items-center gap-2 -ft-2 text-neutral-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <Icon name={p.icon} className="w-4 h-4 text-[#EFB710]" />
                  {p.label}
                </li>
              ))}
            </ul>
        </div>
          <Registro />
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
            <Icon name="sparkles" className="w-5 h-5" />
          </span>
        ))}
      </div>
    </div>
  );
};

const Aprenderas = () => {
  const { aprenderas } = content;
  return (
    <section id="aprenderas" className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>{aprenderas.eyebrow}</Eyebrow>
          <h2 className="text-neutral-900">
            Lo que vas a <span className="wb-hl wb-hl-gold">aprender</span>
          </h2>
        </Reveal>
        <ol className="grid md:grid-cols-2 gap-6 mb-12">
          {aprenderas.items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.08}>
              <div className="group h-full flex gap-6 p-8 rounded-2xl border-2 border-[#EFB710] bg-neutral-50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#EFB710]/25 hover:bg-white">
                <span className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#14151F] text-[#EFB710] flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <Icon name={it.icon} className="w-8 h-8" />
                </span>
                <div>
                  <span className="-ft-2 font-black text-[#8A6700]">{`0${i + 1}`}</span>
                  <h3 className="ft-2 text-neutral-900 mb-2">{it.title}</h3>
                  <p className="ft-0 text-neutral-600">{it.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal className="flex justify-center">
          <CTAButton>{aprenderas.cta}</CTAButton>
        </Reveal>
      </div>
    </section>
  );
};

const ParaQuien = () => {
  const { paraQuien } = content;
  return (
    <section id="para-quien" className="py-24 px-6 bg-neutral-50">
      <div className="container mx-auto max-w-5xl">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>{paraQuien.eyebrow}</Eyebrow>
          <h2 className="text-neutral-900">{paraQuien.title}</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Reveal>
          <ul className="h-full flex flex-col gap-4 p-8 rounded-2xl bg-white border border-neutral-200 -rotate-1">
            {paraQuien.si.map((s) => (
              <li key={s} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#EFB710] text-[#14151F] flex items-center justify-center mt-0.5">
                  <Icon name="check" className="w-4 h-4" />
                </span>
                <span className="ft-1 text-neutral-800">{s}</span>
              </li>
            ))}
          </ul>
          </Reveal>
          <Reveal delay={0.1}>
          <ul className="h-full flex flex-col gap-4 p-8 rounded-2xl bg-[#14151F] rotate-1">
            {paraQuien.no.map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E02424]/20 text-[#FF6B6B] flex items-center justify-center mt-0.5">
                  <Icon name="x" className="w-4 h-4" />
                </span>
                <span className="ft-1 text-neutral-200 uppercase">{n}</span>
              </li>
            ))}
          </ul>
          </Reveal>
        </div>
        <Reveal className="flex justify-center">
          <CTAButton>{paraQuien.cta}</CTAButton>
        </Reveal>
      </div>
    </section>
  );
};

const Metodo = () => {
  const { metodo } = content;
  return (
    <section id="metodo" className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: '#14151F' }}>
      <GridBg />
      <div className="container mx-auto max-w-4xl relative z-10 grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <Reveal>
          <span className="inline-block ft-2 uppercase bg-[#E02424] text-white px-4 py-1.5 rounded-md -rotate-2 mb-4">{metodo.badge}</span>
          <h2 className="ft-11 uppercase mb-6 bg-gradient-to-r from-[#C98A16] via-[#FDE57B] to-[#C98A16] bg-clip-text text-transparent">{metodo.title}</h2>
          <p className="ft-1 text-neutral-300 mb-6 max-w-xl">{metodo.text}</p>
          <ul className="flex flex-col gap-3 mb-10">
            {metodo.points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EFB710] text-[#14151F] flex items-center justify-center mt-0.5">
                  <Icon name="check" className="w-3.5 h-3.5" />
                </span>
                <span className="ft-1 text-neutral-200">{p}</span>
              </li>
            ))}
          </ul>
          <CTAButton>{metodo.cta}</CTAButton>
        </Reveal>
        <Icon name="whirl" className="hidden md:block w-56 h-56 text-[#EFB710]/30" />
      </div>
    </section>
  );
};

const Bonus = () => {
  const { bonus } = content;
  return (
    <section className="py-16 px-6 bg-white">
      <Reveal className="container mx-auto max-w-3xl">
        <div className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-2xl border-2 border-dashed border-[#EFB710] bg-[#EFB710]/10 text-center sm:text-left">
          <span className="wb-note flex-shrink-0 w-20 h-20 rounded-xl bg-[#EFB710] text-[#14151F] flex items-center justify-center">
            <Icon name="gift" className="w-12 h-12" />
          </span>
          <div>
            <Eyebrow>{bonus.eyebrow}</Eyebrow>
            <h3 className="ft-3 text-neutral-900 mb-2">{bonus.title}</h3>
            <p className="ft-1 text-neutral-700">{bonus.text}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const Experto = () => {
  const { experto } = content;
  return (
    <section id="experto" className="py-24 px-6 bg-neutral-50">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <h2 className="text-neutral-900 mb-4">
            {experto.eyebrow} <span className="wb-hl wb-hl-gold">{experto.highlight}</span>
          </h2>
          <p className="ft-6 font-black text-[#8A6700] mb-8">{experto.name}</p>
          <ul className="flex flex-col gap-4">
            {experto.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EFB710] text-[#14151F] flex items-center justify-center mt-0.5">
                  <Icon name="check" className="w-3.5 h-3.5" />
                </span>
                <span className="ft-1 text-neutral-800">{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="relative w-full max-w-[360px] mx-auto">
          <div className="absolute inset-6 bg-[#EFB710] rounded-3xl rotate-3" aria-hidden />
          <Img img={experto.image} sizes="(min-width: 1024px) 360px, (min-width: 768px) 280px, 80vw" className="relative" />
        </Reveal>
      </div>
    </section>
  );
};

const Galeria = () => {
  const { galeria } = content;
  return (
    <section id="galeria" className="py-24 px-6 bg-white">
      <div className="container mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>{galeria.eyebrow}</Eyebrow>
          <h2 className="text-neutral-900">{galeria.title}</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galeria.images.map((img, i) => (
            <Reveal key={img.src} delay={(i % 3) * 0.08}>
              <Img img={img} sizes="(min-width: 768px) 33vw, 50vw" className="rounded-2xl bg-neutral-200 transition-transform duration-300 hover:scale-[1.03] hover:-rotate-1" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Cierre = () => {
  const { cierre } = content;
  return (
    <section className="py-24 px-6 bg-[#EFB710] relative overflow-hidden">
      <Reveal className="container mx-auto max-w-3xl text-center relative z-10">
        <h2 className="text-[#14151F] mb-4">{cierre.title}</h2>
        <p className="ft-2 text-[#14151F]/80 mb-8">{cierre.text}</p>
        <CTAButton dark>{cierre.cta}</CTAButton>
      </Reveal>
    </section>
  );
};

// Barra inferior en móvil: CTA siempre a la mano
const MobileCTA = () => (
  <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#14151F]/90 backdrop-blur-md border-t border-white/10">
    <CTAButton className="w-full">{content.topbar.cta}</CTAButton>
  </div>
);

const Footer = () => (
  <footer className="py-10 pb-28 sm:pb-10 px-6 border-t border-white/5" style={{ backgroundColor: '#14151F' }}>
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      <div>
        <span className="text-white ft-1">{content.footer.brand}</span>
        <p className="text-neutral-400 -ft-3 mt-1 max-w-xl">{content.footer.disclaimer}</p>
      </div>
      <p className="text-neutral-400 -ft-3">{content.footer.copy}</p>
    </div>
  </footer>
);

export default function WebinarLandingPage() {
  return (
    <div className="antialiased overflow-x-hidden">
      <WebinarStyles />
      <MetaPixel />
      <TopBar />
      <Hero />
      <Ticker />
      <Aprenderas />
      <ParaQuien />
      <Metodo />
      <Bonus />
      <Experto />
      <Galeria />
      <Cierre />
      <Footer />
      <MobileCTA />
    </div>
  );
}
