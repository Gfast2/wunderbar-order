import type { StaffLanguage } from '@/app/staff/i18n';

type LoginCopy = {
  languageName: string;
  languageButton: string;
  languageTitle: string;
  closeLanguage: string;
  signInTitle: string;
  signUpTitle: string;
  email: string;
  password: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  loading: string;
  signIn: string;
  signUp: string;
  newToPlatform: string;
  alreadyHaveAccount: string;
  createAccount: string;
  existingAccount: string;
  languageOptions: { value: StaffLanguage; label: string }[];
};

const languageOptions = (labels: Record<StaffLanguage, string>) => [
  { value: 'de' as const, label: labels.de },
  { value: 'en' as const, label: labels.en },
  { value: 'zh-CN' as const, label: labels['zh-CN'] },
  { value: 'zh-TW' as const, label: labels['zh-TW'] },
];

export const loginTranslations: Record<StaffLanguage, LoginCopy> = {
  de: {
    languageName: '🇩🇪',
    languageButton: 'Sprache auswählen',
    languageTitle: 'Sprache / Language',
    closeLanguage: 'Sprachauswahl schließen',
    signInTitle: 'Melden Sie sich an',
    signUpTitle: 'Konto erstellen',
    email: 'E-Mail',
    password: 'Passwort',
    emailPlaceholder: 'E-Mail-Adresse eingeben',
    passwordPlaceholder: 'Passwort eingeben',
    loading: 'Wird geladen...',
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    newToPlatform: 'Neu auf unserer Plattform?',
    alreadyHaveAccount: 'Sie haben bereits ein Konto?',
    createAccount: 'Konto erstellen',
    existingAccount: 'Mit bestehendem Konto anmelden',
    languageOptions: languageOptions({ de: 'Deutsch', en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' }),
  },
  en: {
    languageName: '🇺🇸',
    languageButton: 'Choose language',
    languageTitle: 'Language',
    closeLanguage: 'Close language selection',
    signInTitle: 'Sign in to your account',
    signUpTitle: 'Create your account',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    loading: 'Loading...',
    signIn: 'Sign in',
    signUp: 'Sign up',
    newToPlatform: 'New to our platform?',
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create an account',
    existingAccount: 'Sign in to existing account',
    languageOptions: languageOptions({ de: 'Deutsch', en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' }),
  },
  'zh-CN': {
    languageName: '🇨🇳',
    languageButton: '选择语言',
    languageTitle: '语言',
    closeLanguage: '关闭语言选择',
    signInTitle: '登录您的账户',
    signUpTitle: '创建您的账户',
    email: '邮箱',
    password: '密码',
    emailPlaceholder: '请输入邮箱',
    passwordPlaceholder: '请输入密码',
    loading: '加载中...',
    signIn: '登录',
    signUp: '注册',
    newToPlatform: '还没有账户？',
    alreadyHaveAccount: '已有账户？',
    createAccount: '创建账户',
    existingAccount: '登录已有账户',
    languageOptions: languageOptions({ de: 'Deutsch', en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' }),
  },
  'zh-TW': {
    languageName: '🇹🇼',
    languageButton: '選擇語言',
    languageTitle: '語言',
    closeLanguage: '關閉語言選擇',
    signInTitle: '登入您的帳戶',
    signUpTitle: '建立您的帳戶',
    email: '電子郵件',
    password: '密碼',
    emailPlaceholder: '請輸入電子郵件',
    passwordPlaceholder: '請輸入密碼',
    loading: '載入中...',
    signIn: '登入',
    signUp: '註冊',
    newToPlatform: '還沒有帳戶？',
    alreadyHaveAccount: '已有帳戶？',
    createAccount: '建立帳戶',
    existingAccount: '登入現有帳戶',
    languageOptions: languageOptions({ de: 'Deutsch', en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' }),
  },
};
