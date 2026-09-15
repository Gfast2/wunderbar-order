import type { MenuLanguage } from "../(dashboard)/language-context";

type MenuSectionTranslation = {
  title: string;
  subtitle?: string;
};

export const menuSectionTranslations: Record<
  string,
  Record<MenuLanguage, MenuSectionTranslation>
> = {
  mittagsmenu: {
    de: {
      title: "Mittagsmenü (H1-H12)",
      subtitle:
        "(12:00 - 15:00 Uhr) Zu jedem Gericht: Sauer-Scharf-Suppe als Vorspeise & Reis zum Hauptgang.",
    },
    en: {
      title: "Lunch Menu (H1-H12)",
      subtitle:
        "(12:00 - 15:00) Each dish includes hot and sour soup as a starter and rice as a main course side.",
    },
  },
  gemuese: {
    de: { title: "Gemüse (59-73)" },
    en: { title: "Vegetables (59-73)" },
  },
  desert: {
    de: { title: "Dessert (82-85)" },
    en: { title: "Desserts (82-85)" },
  },
  reiseAndNudeln: {
    de: { title: "Reis & Nudeln (71-81)" },
    en: { title: "Rice & Noodles (71-81)" },
  },
  meeresfruechte: {
    de: { title: "Meeresfrüchte (52-58)" },
    en: { title: "Seafood (52-58)" },
  },
  schwein: {
    de: { title: "Schwein (41-51)" },
    en: { title: "Pork (41-51)" },
  },
  dimsum: {
    de: { title: "Dim Sum (11-20)" },
    en: { title: "Dim Sum (11-20)" },
  },
  vorspeise: {
    de: { title: "Vorspeise (1-10)" },
    en: { title: "Starters (1-10)" },
  },
  suppen: {
    de: { title: "Suppen (11-20)" },
    en: { title: "Soups (11-20)" },
  },
  huhnAndEnte: {
    de: { title: "Hühn & Ente (32-39)" },
    en: { title: "Chicken & Duck (32-39)" },
  },
  rind: {
    de: { title: "Rind (36-39)" },
    en: { title: "Beef (36-39)" },
  },
  lamm: {
    de: { title: "Lamm (36-39)" },
    en: { title: "Lamb (36-39)" },
  },
  getränke: {
    de: { title: "Getränke" },
    en: { title: "Drinks" },
  },
  bierAndWein: {
    de: { title: "Bier & Wein" },
    en: { title: "Beer & Wine" },
  },
};

export const menuTranslations: Record<
  MenuLanguage,
  {
    heading: string;
    allergens: string;
    additives: string;
    chooseVariant: string;
    units: string;
    footer: string;
    backToTop: string;
    openPhoto: (name: string) => string;
    closePhoto: string;
    closeVariantSelection: string;
  }
> = {
  de: {
    heading: "MENÜ",
    allergens: "Allergene",
    additives: "Zusätze",
    chooseVariant: "Auswahl erforderlich",
    units: "Stk",
    footer: "Authentische chinesische Küche in Berlin",
    backToTop: "Nach oben",
    openPhoto: (name) => `Foto von ${name} öffnen`,
    closePhoto: "Foto schließen",
    closeVariantSelection: "Variantenauswahl schließen",
  },
  en: {
    heading: "MENU",
    allergens: "Allergens",
    additives: "Additives",
    chooseVariant: "Selection required",
    units: "pcs",
    footer: "Authentic Chinese cuisine in Berlin",
    backToTop: "Back to top",
    openPhoto: (name) => `Open photo of ${name}`,
    closePhoto: "Close photo",
    closeVariantSelection: "Close variant selection",
  },
};

export function getMenuSectionTranslation(
  sectionId: string,
  language: MenuLanguage,
) {
  return menuSectionTranslations[sectionId][language];
}
