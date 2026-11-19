import Head from 'next/head';
import { info } from '@info';

// Cada página (index, thankyou) trae su propio nav y footer
export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>{`${info.companyName} | ${info.description}`}</title>
        <meta name="description" content={info.description} />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="flex-grow">{children}</main>
    </>
  );
}
