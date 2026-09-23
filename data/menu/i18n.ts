export type MenuSectionTranslation = {
  title: string;
  subtitle?: string;
};

export const menuSectionTranslations: Record<string, Record<'german' | 'english', MenuSectionTranslation>> = {
  mittagsmenu: {
    german: {
      title: 'Mittagsmenü (H1-H12)',
      subtitle: '(12:00 - 15:00 Uhr) Zu jedem Gericht: Sauer-Scharf-Suppe als Vorspeise & Reis zum Hauptgang.',
    },
    english: {
      title: 'Lunch Menu (H1-H12)',
      subtitle: '(12:00 - 15:00) Each dish includes hot and sour soup as a starter and rice as a main course side.',
    },
  },
  gemuese: {
    german: { title: 'Gemüse (59-73)' },
    english: { title: 'Vegetables (59-73)' },
  },
  desert: {
    german: { title: 'Dessert (82-85)' },
    english: { title: 'Desserts (82-85)' },
  },
  reiseAndNudeln: {
    german: { title: 'Reis & Nudeln (71-81)' },
    english: { title: 'Rice & Noodles (71-81)' },
  },
  meeresfruechte: {
    german: { title: 'Meeresfrüchte (52-58)' },
    english: { title: 'Seafood (52-58)' },
  },
  schwein: {
    german: { title: 'Schwein (41-51)' },
    english: { title: 'Pork (41-51)' },
  },
  dimsum: {
    german: { title: 'Dim Sum (11-20)' },
    english: { title: 'Dim Sum (11-20)' },
  },
  vorspeise: {
    german: { title: 'Vorspeise (1-10)' },
    english: { title: 'Starters (1-10)' },
  },
  suppen: {
    german: { title: 'Suppen (11-20)' },
    english: { title: 'Soups (11-20)' },
  },
  huhnAndEnte: {
    german: { title: 'Hühn & Ente (32-39)' },
    english: { title: 'Chicken & Duck (32-39)' },
  },
  rind: {
    german: { title: 'Rind (36-39)' },
    english: { title: 'Beef (36-39)' },
  },
  lamm: {
    german: { title: 'Lamm (40-42)' },
    english: { title: 'Lamb (40-42)' },
  },
  getränke: {
    german: { title: 'Getränke' },
    english: { title: 'Drinks' },
  },
  bierAndWein: {
    german: { title: 'Bier & Wein' },
    english: { title: 'Beer & Wine' },
  },
};

export const menuTranslations = {
  heading: { german: 'Menü', english: 'MENU' },
  allergens: { german: 'Allergene', english: 'Allergens' },
  additives: { german: 'Zusätze', english: 'Additives' },
  photo: { german: 'Foto', english: 'Photo' },
  backToTop: { german: 'Nach oben', english: 'Back to top' },
} as const;
