"use client";

import { useEffect, useState } from "react";
import { additives } from "@/data/keyValue/additive";
import { allergens } from "@/data/keyValue/allergens";
import { bierAndWein } from "@/data/menu/bierAndWein";
import { desert } from "@/data/menu/desert";
import { dimsum } from "@/data/menu/dimsum";
import { gemüse } from "@/data/menu/gemüse";
import { getränke } from "@/data/menu/getränke";
import { huhnAndEnte } from "@/data/menu/huhnAndEnte";
import { lamm } from "@/data/menu/lamm";
import { meeresfrüchte } from "@/data/menu/meeresfrüchte";
import { mittagsmenü } from "@/data/menu/mittagsmenu";
import { rind } from "@/data/menu/rind";
import { reiseAndNudeln } from "@/data/menu/reiseAndNudeln";
import { schwein } from "@/data/menu/schwein";
import { suppen } from "@/data/menu/suppen";
import { vorspeise } from "@/data/menu/vorspeise";

const formatLabels = (value: string | undefined, map: Record<string, string>) =>
  value
    ?.split(",")
    .map((code) => code.trim())
    .filter(Boolean)
    .map((code) => map[code])
    .filter(Boolean)
    .join(", ") ?? null;

const menuSections = [
  {
    id: "mittagsmenu",
    title: "Mittagsmenü (H1-H12)",
    subtitle:
      "(12:00 - 15:00 Uhr) Zu jedem Gericht: Sauer-Scharf-Suppe als Vorspeise & Reis zum Hauptgang.",
    items: mittagsmenü,
  },
  { id: "gemuese", title: "Gemüse (59-73)", items: gemüse },
  { id: "desert", title: "Dessert (82-85)", items: desert },
  { id: "reiseAndNudeln", title: "Reis & Nudeln (71-81)", items: reiseAndNudeln },
  { id: "meeresfruechte", title: "Meeresfrüchte (52-58)", items: meeresfrüchte },
  { id: "schwein", title: "Schwein (41-51)", items: schwein },
  { id: "dimsum", title: "Dim Sum (11-20)", items: dimsum },
  { id: "vorspeise", title: "Vorspeise (1-10)", items: vorspeise },
  { id: "suppen", title: "Suppen (11-20)", items: suppen },
  { id: "huhnAndEnte", title: "Hühn & Ente (32-39)", items: huhnAndEnte },
  { id: "rind", title: "Rind (36-39)", items: rind },
  { id: "lamm", title: "Lamm (36-39)", items: lamm },
  { id: "getränke", title: "Getränke", items: getränke },
  { id: "bierAndWein", title: "Bier & Wein", items: bierAndWein },
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
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((item) => {
                  const allergensText = formatLabels(item.allergens, allergens);
                  const additiviesText = formatLabels(item.additive, additives);

                  return (
                    <article
                      key={`${section.id}-${item.number}`}
                      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold uppercase tracking-[0.08em] text-amber-700">
                              {item.number}
                            </span>
                            <h3 className="text-base font-semibold text-zinc-900">
                              {item.name_german}
                            </h3>
                          </div>

                          {item.name_chinese ? (
                            <p className="mt-1 text-xs tracking-[0.08em] text-zinc-500">
                              {item.name_chinese}
                            </p>
                          ) : null}

                          {item.description ? (
                            <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
                          ) : null}

                          {allergensText ? (
                            <p className="mt-2 text-xs text-amber-700">
                              Allergene: {allergensText}
                            </p>
                          ) : null}

                          {additiviesText ? (
                            <p className="mt-1 text-xs text-amber-700">
                              Zusätze: {additiviesText}
                            </p>
                          ) : null}
                        </div>

                        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-700">
                          {item.price} €
                        </span>
                      </div>
                    </article>
                  );
                })}
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
