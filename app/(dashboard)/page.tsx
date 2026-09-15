'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { useLanguage } from '@/app/language-context';
import { menuTranslations } from '../menu/i18n';

export default function HomePage() {
  const { language } = useLanguage();
  const copy = menuTranslations[language];

  return (
    <main>
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Wunderbar
                <span className="block text-orange-500">Order</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                {copy.scanTableToOrder}
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link href="/menu">{copy.startOrdering}</Link>
              </Button>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a
                  href="https://vercel.com/templates/next.js/next-js-saas-starter"
                  target="_blank"
                >
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Logo />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
