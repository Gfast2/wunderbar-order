'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, X } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { loginTranslations } from './i18n';
import type { StaffLanguage } from '@/app/staff/i18n';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const [language, setLanguage] = useState<StaffLanguage>('en');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const copy = loginTranslations[language];
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label={copy.languageButton}
            onClick={() => setIsLanguageOpen(true)}
            className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-3 text-xl leading-none transition hover:border-orange-400"
          >
            {copy.languageName}
          </button>
        </div>
        <div className="flex justify-center">
          <div className="w-[150px] rounded-lg shadow-lg overflow-hidden bg-gray-900 text-white font-mono text-sm">
            <img src="logo-icon.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin'
            ? copy.signInTitle
            : copy.signUpTitle}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" action={formAction}>
          <input type="hidden" name="redirect" value={redirect || ''} />
          <input type="hidden" name="priceId" value={priceId || ''} />
          <input type="hidden" name="inviteId" value={inviteId || ''} />
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {copy.email}
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                required
                maxLength={50}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder={copy.emailPlaceholder}
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {copy.password}
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder={copy.passwordPlaceholder}
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-red-500 text-sm">{state.error}</div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {copy.loading}
                </>
              ) : mode === 'signin' ? (
                copy.signIn
              ) : (
                copy.signUp
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                {mode === 'signin'
                  ? copy.newToPlatform
                  : copy.alreadyHaveAccount}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `&priceId=${priceId}` : ''}`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {mode === 'signin'
                ? copy.createAccount
                : copy.existingAccount}
            </Link>
          </div>
        </div>
      </div>

      {isLanguageOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-language-title"
          onClick={() => setIsLanguageOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 id="login-language-title" className="text-xl font-semibold text-gray-900">
                {copy.languageTitle}
              </h2>
              <button
                type="button"
                aria-label={copy.closeLanguage}
                onClick={() => setIsLanguageOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <RadioGroup
              value={language}
              onValueChange={(value) => {
                setLanguage(value as StaffLanguage);
                setIsLanguageOpen(false);
              }}
              className="mt-5"
            >
              {copy.languageOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`login-language-${option.value}`}
                  className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-200 px-4 py-3 text-base font-medium text-gray-800 transition-colors hover:border-orange-300 hover:bg-orange-50"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`login-language-${option.value}`}
                    className="size-5"
                  />
                  {option.label}
                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>
      ) : null}
    </div>
  );
}
