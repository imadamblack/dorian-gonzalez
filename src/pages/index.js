'use client';

import { useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import OptInForm from './../components/form/opt-in-form';

/*
  Notas de performance
  1. Video de Vimeo como "facade": solo se carga el iframe (aprox. 1 MB de JS) cuando el usuario da play.
     El poster es local (/gdl/video-poster.webp).
  2. Google Maps como "facade": el iframe se carga solo al hacer clic.
  3. Meta Pixel con next/script strategy="lazyOnload" (no bloquea el render).
  4. Todo el texto de venta es HTML real (antes vivía en PNGs). Solo quedan como imagen las fotos.
     Imágenes locales en /public/gdl con next/image (WebP, lazy, sizes responsivos). Next.js 12.2: layout="responsive".
  5. Se eliminan Elementor, PixelYourSite y restos de la plantilla demo.
*/

const ASSETS = '/gdl';
const VIMEO_ID = '1216349601';
const PIXEL_ID = '1607715167316214';
const MAPS_QUERY = 'Av. Adolfo López Mateos Sur 4321, La Calma, Zapopan, Jal.';

// Paleta tomada de las piezas gráficas originales
// Primario (dorado) #EFB710 · Hover #D9A30B · Acento rojo #E02424 · Oscuro #14151F
// Dorado legible sobre fondo claro: #8A6700

// Sin "export": en Next 12 un page que exporta algo además del componente rompe Fast Refresh (loop de recargas)
const content = {
  nav: {
    brand: 'Más Ventas Online',
    cta: 'DESEO INSCRIBIRME',
  },
  hero: {
    badge: 'Curso presencial',
    title: 'Redes sociales, Inteligencia artificial y técnica de ventas',
    tagline: 'Sin tener que ser experto en tecnología',
    highlight: '100% enfocado en ventas',
    platforms: [
      { icon: 'facebook', label: 'Facebook' },
      { icon: 'instagram', label: 'Instagram' },
      { icon: 'whatsapp', label: 'WhatsApp' },
      { icon: 'robot', label: 'Inteligencia artificial' },
      { icon: 'tiktok', label: 'TikTok' },
      { icon: 'sparkles', label: 'ChatGPT' },
    ],
    city: 'GUADALAJARA',
    video: {
      title: 'Curso presencial Guadalajara',
      playLabel: 'Reproducir video',
      poster: { src: `${ASSETS}/video-poster.webp`, w: 640, h: 360 },
    },
    subtitle: 'Partimos completamente DESDE 0',
    negations: [
      'No necesitas experiencia en marketing',
      'No necesitas ser experto en tecnología',
      'No necesitas seguidores',
    ],
    cta: 'DESEO INSCRIBIRME',
  },
  fechas: {
    eyebrow: 'Fechas',
    title: '¿Cuándo será el curso en tu ciudad?',
    cards: [
      { icon: 'calendar', label: 'Duración de dos días', lines: ['Sábado 22', 'Domingo 23'], foot: 'Agosto' },
      { icon: 'clock', label: 'Horario', lines: ['9:00AM a 3:00PM'], foot: 'Ambos días' },
      { icon: 'user', label: 'Modalidad', lines: ['Presencial'] },
    ],
    note: 'Ya que es un curso 100% práctico, es necesario que lleves tu lap top y cargador (podemos prestarte una si no tienes)',
  },
  metodo: {
    badge: 'Nuevo método',
    titleLines: 'CREE-SER',
    points: ['Sin tener que ser experto en tecnología', 'Sin tener que tener miles de seguidores'],
    cta: 'DESEO INSCRIBIRME',
  },
  ubicacion: {
    eyebrow: 'Ubicación',
    title: '¿Dónde se impartirá el curso presencial?',
    venue: 'IIDEA BUSINESS CENTER',
    address: MAPS_QUERY,
    image: {
      src: `${ASSETS}/sede-iidea.jpg`,
      w: 1024,
      h: 538,
      alt: 'Fachada de IIDEA Business Center en Zapopan',
    },
    map: {
      load: 'Ver mapa',
      open: 'Abrir en Google Maps',
    },
  },
  inversion: {
    eyebrow: 'Inversión',
    title: '¿Cuál es la inversión?',
    priceLabel: '¡Inversión total!',
    price: '$2,600',
    priceUnit: 'por persona',
    deposit: 'Inscríbete con 600 y liquida el primer día de curso',
    cupo: 'Cupo limitado a solo 20 Personas',
    incluye: 'Incluye seguimiento por 6 meses a tus dudas, reuniones cada 15 días para ayudarte a mejorar tus estrategias sin costo extra.',
    certificado: 'Entregamos certificado con validez oficial ante la SEP',
    cta: 'DESEO INSCRIBIRME',
  },
  experto: {
    eyebrow: '¿Quién es el',
    highlight: 'experto',
    titleEnd: '?',
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
    title: 'Cursos anteriores',
    images: [70, 67, 68, 66, 69, 71, 72, 64, 61].map((n, i) => ({
      src: `${ASSETS}/curso-anterior-${n}.jpg`,
      w: 768,
      h: 768,
      alt: `Grupo de un curso presencial anterior de Más Ventas Online, foto ${i + 1}`,
    })),
    cta: 'DESEO INSCRIBIRME',
  },
  contacto: {
    title: 'Llena este formulario',
    subtitle: 'Nuestro equipo te contactará por WhatsApp',
    description:
      'Resolveremos cualquier duda que tengas y te daremos seguimiento para iniciar con tu proceso de inscripción.',
    submit: 'CONTACTAR ASESOR',
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
    play: (
      <svg {...solid}>
        <path d="M8 5.14v13.72a1 1 0 001.52.85l11.05-6.86a1 1 0 000-1.7L9.52 4.29A1 1 0 008 5.14z" />
      </svg>
    ),
    pin: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
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
    user: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    laptop: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
    award: (
      <svg {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
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
    robot: (
      <svg {...stroke} strokeWidth={2}>
        <rect x="4.5" y="7.5" width="15" height="12" rx="3" />
        <path strokeLinecap="round" d="M12 7.5V4m0 0h.01M9.5 12.5v1M14.5 12.5v1M9.5 16.5h5M2.5 12v3M21.5 12v3" />
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

const CTAButton = ({ children, variant = 'primary', size = 'md', href = '#inscripcion', className = '', icon = 'arrow', ...props }) => {
  const sizing = size === 'sm' ? 'px-4 py-2.5 -ft-2 whitespace-nowrap' : 'px-7 py-4 ft-1';
  if (variant === 'primary') {
    return (
      <a
        href={href}
        className={`cursor-pointer inline-flex items-center gap-2 bg-[#EFB710] hover:bg-[#D9A30B] text-[#14151F] font-bold rounded-xl transition-all duration-200 shadow-lg shadow-[#EFB710]/25 hover:shadow-[#EFB710]/40 ${sizing} ${className}`}
        {...props}
      >
        {children}
        <Icon name={icon} className="w-4 h-4" />
      </a>
    );
  }
  return (
    <a
      href={href}
      className={`cursor-pointer inline-flex items-center gap-2 bg-[#14151F] hover:bg-black text-white font-bold rounded-xl transition-all duration-200 ${sizing} ${className}`}
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

// Resetea el estilo global de <button> (globals.scss) en botones que no son CTA
const bareButton = '!p-0 !w-full !bg-transparent !rounded-none hover:!translate-y-0 hover:!brightness-100';

// Imagen optimizada reutilizable (lazy por defecto; empieza a cargar 600px antes de entrar en pantalla)
const Img = ({ img, sizes = '(min-width: 1024px) 768px, 100vw', className = '', priority = false }) => (
  <div className={`overflow-hidden ${className}`}>
    <Image
      src={img.src}
      width={img.w}
      height={img.h}
      alt={img.alt}
      sizes={sizes}
      priority={priority}
      layout="responsive"
      lazyBoundary="600px"
    />
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

const Nav = () => (
  <nav className="fixed py-4 top-0 left-0 right-0 z-50 bg-[#14151F]/85 backdrop-blur-md border-b border-white/10">
    <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
      <span className="-ft-1 text-white">{content.nav.brand}</span>
      <CTAButton size="sm">{content.nav.cta}</CTAButton>
    </div>
  </nav>
);

// Facade de Vimeo: poster local, el iframe se monta solo al dar play
const VimeoFacade = () => {
  const [play, setPlay] = useState(false);
  const { video } = content.hero;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl shadow-black/50 ring-1 ring-white/10">
      {play ? (
        <iframe
          src={`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&autopause=0&title=0&byline=0&portrait=0`}
          title={video.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          aria-label={video.playLabel}
          className={`group absolute inset-0 h-full cursor-pointer ${bareButton}`}
        >
          <img
            src={video.poster.src}
            width={video.poster.w}
            height={video.poster.h}
            alt=""
            fetchpriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-20 h-20 rounded-full bg-[#EFB710] text-[#14151F] flex items-center justify-center shadow-xl shadow-black/40 group-hover:scale-110 transition-transform">
              <Icon name="play" className="w-9 h-9 ml-1" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
};

const Hero = () => {
  const { hero } = content;
  return (
    <section className="pt-32 pb-24 px-6 relative overflow-hidden" style={{ backgroundColor: '#14151F' }}>
      <GridBg opacity="opacity-[0.08]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#EFB710] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="mx-auto text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 -ft-3 tracking-widest uppercase bg-white/10 text-neutral-300 border border-white/10 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EFB710] animate-pulse" />
              {hero.badge}
            </span>
          </div>

          <h1 className="max-w-6xl mx-auto ft-10 text-white uppercase mb-6">
            {hero.title}
          </h1>
          <p className="ft-2 uppercase text-neutral-200 mb-2">{hero.tagline}</p>
          <p className="ft-6 uppercase font-bold bg-gradient-to-r from-[#C98A16] via-[#FDE57B] to-[#C98A16] bg-clip-text text-transparent mb-8">
            {hero.highlight}
          </p>

          <p className="inline-flex items-center gap-2 ft-6 text-white mb-8">
            <Icon name="pin" className="w-7 h-7 text-[#EFB710]" />
            {hero.city}
          </p>

          <VimeoFacade />

          <h3 className="text-white mt-12 mb-8">{hero.subtitle}</h3>
          <ul className="grid gap-3 sm:grid-cols-3 mb-12 text-left">
            {hero.negations.map((n) => (
              <li key={n} className="flex items-center justify-start gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 p-8">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E02424]/20 text-[#FF6B6B] flex items-center justify-center">
                  <Icon name="x" className="w-8 h-8" />
                </span>
                <span className="ft-0 text-neutral-200 uppercase">{n}</span>
              </li>
            ))}
          </ul>
          <CTAButton>{hero.cta}</CTAButton>
        </div>
      </div>
    </section>
  );
};

const Fechas = () => {
  const { fechas } = content;
  return (
    <section id="fechas" className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>{fechas.eyebrow}</Eyebrow>
          <h2 className="text-neutral-900">{fechas.title}</h2>
        </div>
        <div className="grid md:grid-cols-1 gap-6 mb-12">
          {fechas.cards.map((c) => (
            <div key={c.label} className="flex items-center text-center p-8 gap-8 rounded-2xl border-2 border-[#EFB710] bg-neutral-50">
              <span className="w-40 aspect-square p-8 rounded-2xl bg-[#14151F] text-[#EFB710] flex items-center justify-center mb-6">
                <Icon name={c.icon} className="w-full aspect-square" />
              </span>
              <div className="text-left">
                <h3 className="ft-2 text-[#8A6700] mb-2">{c.label}</h3>
                {c.lines.map((l) => (
                  <p key={l} className="ft-1 text-neutral-900">{l}</p>
                ))}
                {c.foot && <p className="ft-2 text-[#8A6700] mt-2">{c.foot}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-4 max-w-3xl mx-auto p-6 rounded-2xl bg-[#E02424]/5 border border-[#E02424]/20">
          <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#E02424] text-white flex items-center justify-center">
            <Icon name="laptop" className="w-6 h-6" />
          </span>
          <p className="ft-1 text-neutral-800">{fechas.note}</p>
        </div>
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
        <div>
          <span className="inline-block ft-2 uppercase bg-[#E02424] text-white px-4 py-1.5 rounded-md -rotate-2 mb-4">
            {metodo.badge}
          </span>
          <h2 className="ft-11 uppercase mb-8">
            <span className="block text-white">{metodo.titleLines}</span>
          </h2>
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
        </div>
        <Icon name="whirl" className="hidden md:block w-56 h-56 text-white/20" />
      </div>
    </section>
  );
};

// Facade de Google Maps: el iframe solo se carga si el usuario lo pide
const MapFacade = () => {
  const q = encodeURIComponent(MAPS_QUERY);
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
      <iframe
        src={`https://maps.google.com/maps?q=${q}&t=m&z=15&output=embed&iwloc=near`}
        title={content.ubicacion.venue}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

const Ubicacion = () => {
  const { ubicacion } = content;
  return (
    <section id="ubicacion" className="py-24 px-6 bg-neutral-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="w-full mb-12 gap-8">
            <Eyebrow>{ubicacion.eyebrow}</Eyebrow>
            <h2 className="text-neutral-900 mb-6">{ubicacion.title}</h2>
            <h3 className="ft-2 text-neutral-900 mb-2">{ubicacion.venue}</h3>
            <p className="ft-1 text-neutral-600 flex items-start gap-2">
              <Icon name="pin" className="w-5 h-5 mt-1 flex-shrink-0 text-[#8A6700]" />
              {ubicacion.address}
            </p>
            <Img img={ubicacion.image} sizes="(min-width: 1024px) 50vw, 100vw" className="rounded-2xl" />
          </div>
          <MapFacade />
        </div>
      </div>
    </section>
  );
};

const Inversion = () => {
  const { inversion } = content;
  return (
    <section id="inversion" className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: '#14151F' }}>
      <GridBg />
      <div className="container mx-auto max-w-3xl relative z-10 text-center">
        <Eyebrow dark>{inversion.eyebrow}</Eyebrow>
        <h2 className="text-white mb-10">{inversion.title}</h2>

        <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-[#EFB710]/40 mb-8">
          <p className="ft-3 uppercase text-white mb-2">{inversion.priceLabel}</p>
          <p className="text-[#EFB710] mb-6">
            <span className="ft-10 font-black">{inversion.price}</span><br/>
            <span className="ft-3 uppercase">{inversion.priceUnit}</span>
          </p>
          <p className="inline-block ft-1 text-white bg-white/10 px-5 py-3 rounded-xl mb-8">{inversion.deposit}</p>

          <div className="h-px bg-white/10 mb-8" />

          <div className="inline-flex items-center gap-3 mb-4">
            <h3 className="text-white">{inversion.cupo}</h3>
          </div>
          <p className="ft-1 text-neutral-300 max-w-xl mx-auto mb-8">{inversion.incluye}</p>
          <CTAButton>{inversion.cta}</CTAButton>
        </div>

        <div className="w-full border-[#EFB710] bg-[#EFB710]/10 flex items-center justify-center gap-8 p-8 rounded-2xl text-left">
          <span className="flex-shrink-0 w-20 h-20 rounded-xl bg-[#EFB710] text-[#14151F] flex items-center justify-center">
            <Icon name="award" className="w-12 h-12" />
          </span>
          <p className="ft-2 text-white">{inversion.certificado}</p>
        </div>
      </div>
    </section>
  );
};

const Experto = () => {
  const { experto } = content;
  return (
    <section id="experto" className="py-24 px-6 bg-white">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-neutral-900 mb-4">
            {experto.eyebrow} <span className="text-[#8A6700] italic">{experto.highlight}</span>
            {experto.titleEnd}
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
        </div>
        <Img img={experto.image} sizes="(min-width: 1024px) 360px, (min-width: 768px) 280px, 80vw" className="w-full max-w-[360px] mx-auto object-center" />
      </div>
    </section>
  );
};

const Galeria = () => {
  const { galeria } = content;
  return (
    <section id="galeria" className="py-24 px-6 bg-neutral-50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Eyebrow>{galeria.eyebrow}</Eyebrow>
          <h2 className="text-neutral-900">{galeria.title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {galeria.images.map((img) => (
            <Img key={img.src} img={img} sizes="(min-width: 768px) 33vw, 50vw" className="rounded-2xl bg-neutral-200" />
          ))}
        </div>
        <div className="flex justify-center">
          <CTAButton>{galeria.cta}</CTAButton>
        </div>
      </div>
    </section>
  );
};

const Contacto = () => {
  const { contacto } = content;
  return (
    <section id="inscripcion" className="py-24 px-6 bg-[#EFB710] scroll-mt-16">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-[#14151F] mb-3">{contacto.title}</h2>
          <p className="ft-2 text-[#14151F] mb-3">{contacto.subtitle}</p>
          <p className="ft-1 text-[#14151F]/80">{contacto.description}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
          <OptInForm submitLabel={contacto.submit} submitClassName="!w-full !bg-[#14151F] !text-white" />
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
      <p className="text-neutral-400 -ft-3">{content.footer.copy}</p>
    </div>
  </footer>
);

export default function MasVentasOnlineLandingPage() {
  return (
    <div className="antialiased">
      <MetaPixel />
      <Nav />
      <Hero />
      <Fechas />
      <Metodo />
      <Ubicacion />
      <Inversion />
      <Contacto />
      <Experto />
      <Galeria />
      <Footer />
    </div>
  );
}
