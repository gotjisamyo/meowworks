import Head from 'next/head';
import Link from 'next/link';
import { BRAND_COMPANY, BRAND_NAME, SITE_URL } from '../lib/site';

type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

interface LegalPageProps {
  title: string;
  description: string;
  path: string;
  eyebrow: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
  contactTitle: string;
  contactBody: string[];
}

export default function LegalPage({
  title,
  description,
  path,
  eyebrow,
  effectiveDate,
  intro,
  sections,
  contactTitle,
  contactBody,
}: LegalPageProps) {
  const canonical = `${SITE_URL}${path}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={canonical} />
      </Head>

      <div className="min-h-screen bg-brand-dark text-white">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-dark/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-3 font-black text-lg">
              <img src="/assets/hero-cat.png" alt={BRAND_NAME} width={30} height={30} className="rounded-full" />
              <span>{BRAND_NAME}</span>
            </Link>
            <Link href="/" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-brand-pink/40 hover:text-white">
              กลับหน้าหลัก
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
            <div className="mb-4 inline-flex rounded-full border border-brand-pink/30 bg-brand-pink/10 px-4 py-1.5 text-sm font-bold text-brand-rose">
              {eyebrow}
            </div>
            <h1 className="mb-3 text-3xl font-black md:text-5xl">{title}</h1>
            <p className="mb-4 max-w-3xl text-white/60 md:text-lg">{intro}</p>
            <p className="text-sm text-white/35">มีผลบังคับใช้: {effectiveDate}</p>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <section key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-orange/30 bg-brand-orange/10 text-sm font-black text-brand-orange">
                    {index + 1}
                  </div>
                  <h2 className="text-xl font-black md:text-2xl">{section.title}</h2>
                </div>

                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mb-3 leading-7 text-white/65 last:mb-0">
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="space-y-3 text-white/65">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 leading-7">
                        <span className="mt-1 text-brand-orange">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="rounded-3xl border border-brand-pink/20 bg-brand-pink/10 p-6 md:p-8">
              <h2 className="mb-3 text-xl font-black md:text-2xl">{contactTitle}</h2>
              {contactBody.map((paragraph) => (
                <p key={paragraph} className="mb-3 leading-7 text-white/75 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </section>
          </div>
        </main>

        <footer className="border-t border-white/10 py-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-center text-sm text-white/35 md:flex-row md:text-left">
            <p>© 2026 {BRAND_NAME} by {BRAND_COMPANY}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="hover:text-white/70">Privacy</Link>
              <Link href="/terms" className="hover:text-white/70">Terms</Link>
              <Link href="/dpa" className="hover:text-white/70">DPA</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
