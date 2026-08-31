"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  name: string;
  description?: string;
  price: string;
};

type MenuSectionType = {
  id: string;
  title: string;
  range?: string;
  subtitle?: string;
  items: MenuItem[];
};

const menuSections: MenuSectionType[] = [
  {
    id: "mittagsmenu",
    title: "Mittagsmenü (H1-H12)",
    subtitle:
      "(12:00 - 15:00 Uhr) Zu jedem Gericht: Sauer-Scharf-Suppe als Vorspeise & Reis zum Hauptgang.",
    items: [
      { name: "H1 – Schwein & Gemüse", description: "Knuspriges Schweinefleisch mit frischem Gemüse", price: "12,90€" },
      { name: "H2 – Hühnerfleisch mit Chili", description: "Würziges Hähnchen in süß-saurer Sauce", price: "12,90€" },
      { name: "H3 – Rindfleisch mit Brokkoli", description: "Zartes Rind mit knusprigem Brokkoli", price: "13,90€" },
      { name: "H4 – Garnelen mit Gemüse", description: "Frische Garnelen in mildem Wok-Geschmack", price: "14,90€" },
      { name: "H5 – Lamm mit Bambus", description: "Aromatisches Lamm mit Bambussprossen", price: "14,90€" },
      { name: "H6 – Tofu & Erdnuss", description: "Vegetarisch mit cremiger Erdnusssauce", price: "11,90€" },
    ],
  },
  {
    id: "gemuese",
    title: "Gemüse (59-73)",
    items: [
      { name: "Gemüsebowl mit Kichererbsen", description: "Frisch, leicht und proteinreich", price: "12,50€" },
      { name: "Chinesisches Brokkoli", description: "Mit Knoblauch und Sojasauce", price: "11,50€" },
      { name: "Tofu mit Bambussprossen", description: "Sanft gewürzt und knackig", price: "12,80€" },
      { name: "Pak Choi mit Shiitake", description: "Leicht gebraten und aromatisch", price: "12,20€" },
    ],
  },
  {
    id: "desert",
    title: "Dessert (82-85)",
    items: [
      { name: "Vanille-Eis", description: "Klassisch und cremig", price: "4,50€" },
      { name: "Sesam-Mango-Pudding", description: "Leicht süß und frisch", price: "5,50€" },
      { name: "Schokoladen-Nougat-Eis", description: "Reichhaltig und cremig", price: "5,80€" },
    ],
  },
  {
    id: "reiseAndNudeln",
    title: "Reis & Nudeln (71-81)",
    items: [
      { name: "Gebratener Reis", description: "Mit Ei, Gemüse und Frühlingszwiebeln", price: "11,90€" },
      { name: "Hühner-Nudeln", description: "Mit Wok-Gemüse und mildem Sauce", price: "13,20€" },
      { name: "Rind-Nudeln", description: "Aromatisch und würzig", price: "13,90€" },
      { name: "Gemüse-Reis", description: "Leicht, frisch und vegetarisch", price: "10,90€" },
    ],
  },
  {
    id: "meeresfruechte",
    title: "Meeresfrüchte (52-58)",
    items: [
      { name: "Knoblauch-Garnelen", description: "Mit würziger Knoblauch-Sojasauce", price: "15,50€" },
      { name: "Krebstiere mit Gemüse", description: "Leicht gedünstet und aromatisch", price: "16,20€" },
      { name: "Curry-Fisch", description: "Mit Kokos- und Curry-Aroma", price: "15,90€" },
    ],
  },
  {
    id: "schwein",
    title: "Schwein (41-51)",
    items: [
      { name: "Schweinefilet & Brokkoli", description: "Sanft gebraten mit mildem Aroma", price: "13,90€" },
      { name: "Krautschweinefleisch", description: "Scharf und saftig", price: "13,60€" },
      { name: "Schweinefleisch mit Ingwer", description: "Frisch und leicht aromatisch", price: "13,20€" },
      { name: "Schweinefleisch mit Gemüse", description: "Wok-gebraten mit knackiger Textur", price: "13,80€" },
    ],
  },
  {
    id: "dimsum",
    title: "Dim Sum (11-20)",
    items: [
      { name: "Har Gao", description: "Krabben-Dim Sum", price: "7,90€" },
      { name: "Siu Mai", description: "Hackfleisch mit Gemüse", price: "7,50€" },
      { name: "Spinats-Dim Sum", description: "Vegetarisch und leicht", price: "6,90€" },
      { name: "Gemüse-Dumplings", description: "Frisch gekocht und aromatisch", price: "6,70€" },
    ],
  },
  {
    id: "vorspeise",
    title: "Vorspeise (1-10)",
    items: [
      { name: "Frühlingsrollen", description: "Krispig und leicht gewürzt", price: "5,90€" },
      { name: "Edamame", description: "Mit Meersalz und Chili", price: "5,20€" },
      { name: "Gekühlte Nudelsalat", description: "Frisch und leicht", price: "6,20€" },
      { name: "Scharfe Gurken", description: "Erfrischend und knackig", price: "4,80€" },
    ],
  },
  {
    id: "suppen",
    title: "Suppen (11-20)",
    items: [
      { name: "Sauer-Scharf-Suppe", description: "Klassisch mit Gemüse und Tofu", price: "6,50€" },
      { name: "Wonton-Suppe", description: "Mit Fleischfüllung und Frühlingszwiebeln", price: "7,20€" },
      { name: "Hühnersuppe", description: "Sanft und beruhigend", price: "6,90€" },
    ],
  },
  {
    id: "huhnAndEnte",
    title: "Hühn & Ente (32-39)",
    items: [
      { name: "Hähnchen mit Cashew", description: "Mit Cashewnüssen und Gemüse", price: "13,50€" },
      { name: "Knusprige Entenbrust", description: "Mit süß-saurem Gemüse", price: "15,20€" },
      { name: "Hähnchen mit Chili", description: "Würzig und aromatisch", price: "13,90€" },
    ],
  },
  {
    id: "rind",
    title: "Rind (36-39)",
    items: [
      { name: "Rindfleisch mit Bambus", description: "Zartes Rind mit Bambussprossen", price: "15,30€" },
      { name: "Rind mit Sojasauce", description: "Mild, aber voller Geschmack", price: "14,90€" },
      { name: "Rind & Gemüse", description: "Mit frischem Gemüse und Wok-Sauce", price: "15,10€" },
    ],
  },
  {
    id: "lamm",
    title: "Lamm (36-39)",
    items: [
      { name: "Lamm mit Koriander", description: "Aromatisch und würzig", price: "15,60€" },
      { name: "Lamm mit Chili", description: "Heiß, kräftig und vollmundig", price: "15,80€" },
      { name: "Lamm mit Gemüse", description: "Sanft gebraten mit aromatischen Gewürzen", price: "15,40€" },
    ],
  },
  {
    id: "getränke",
    title: "Getränke",
    items: [
      { name: "Wasser still / sprudel", price: "2,50€" },
      { name: "Eistee", price: "3,20€" },
      { name: "Fruchtsaft", price: "3,50€" },
      { name: "Softdrinks", price: "3,00€" },
    ],
  },
  {
    id: "bierAndWein",
    title: "Bier & Wein",
    items: [
      { name: "Pilsner", price: "4,50€" },
      { name: "Weißbier", price: "4,80€" },
      { name: "Rotwein", price: "6,50€" },
      { name: "Weißwein", price: "6,50€" },
    ],
  },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("mittagsmenu");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    const section = document.getElementById(category);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main>
      <div>
        <header className="border-b-4 border-amber-400 px-5 pb-6 pt-10 text-center sm:px-8 lg:px-10">
          <h1 className="text-3xl font-bold tracking-[0.12em] text-zinc-900 sm:text-4xl">
            MENÜ
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {menuSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => handleCategoryClick(section.id)}
                className={[
                  "rounded-full border-2 border-amber-400 px-4 py-2 text-sm font-semibold transition-all duration-300 sm:px-5",
                  activeCategory === section.id
                    ? "bg-amber-400 text-white shadow-[0_6px_18px_rgba(212,175,55,0.35)]"
                    : "bg-transparent text-amber-500 hover:scale-[1.03] hover:bg-amber-50",
                ].join(" ")}
              >
                {section.title.replace(/\s*\([^)]*\)/, "")}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-8 px-5 py-8 sm:px-8 lg:px-10">
          {menuSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm sm:p-6"
            >
              <div className="mb-5 flex flex-col gap-2 border-b border-zinc-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">{section.title}</h2>
                  {section.subtitle ? (
                    <p className="mt-1 text-sm text-zinc-600">{section.subtitle}</p>
                  ) : null}
                </div>
                {section.range ? (
                  <span className="text-sm font-semibold uppercase tracking-[0.08em] text-amber-600">
                    {section.range}
                  </span>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <article
                    key={`${section.id}-${item.name}`}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-900">{item.name}</h3>
                        {item.description ? (
                          <p className="mt-1 text-sm text-zinc-600">{item.description}</p>
                        ) : null}
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-700">
                        {item.price}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="border-t-2 border-amber-400 px-5 py-6 text-center text-sm text-zinc-600 sm:px-8">
          <p className="font-medium">Authentische chinesische Küche in Berlin</p>
        </div>
      </div>

      {showBackToTop ? (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-7 right-7 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-white shadow-[0_10px_24px_rgba(212,175,55,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-500"
        >
          ↑
        </button>
      ) : null}
    </main>
  );
}
