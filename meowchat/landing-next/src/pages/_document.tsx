import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="th">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
        <link rel="apple-touch-icon" href="/assets/apple-icon.png" />
      </Head>
      <body className="bg-brand-dark text-white font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
