import type { Menu } from "@/data/content.config";
import { bierAndWein } from "@/data/menu/bierAndWein";
import { desert } from "@/data/menu/desert";
import { dimsum } from "@/data/menu/dimsum";
import { gemüse } from "@/data/menu/gemüse";
import { getränke } from "@/data/menu/getränke";
import { huhnAndEnte } from "@/data/menu/huhnAndEnte";
import { lamm } from "@/data/menu/lamm";
import { meeresfrüchte } from "@/data/menu/meeresfrüchte";
import { mittagsmenü } from "@/data/menu/mittagsmenu";
import { reiseAndNudeln } from "@/data/menu/reiseAndNudeln";
import { rind } from "@/data/menu/rind";
import { schwein } from "@/data/menu/schwein";
import { suppen } from "@/data/menu/suppen";
import { vorspeise } from "@/data/menu/vorspeise";

const menuItems: Menu[] = [
  ...mittagsmenü,
  ...gemüse,
  ...desert,
  ...reiseAndNudeln,
  ...meeresfrüchte,
  ...schwein,
  ...dimsum,
  ...vorspeise,
  ...suppen,
  ...huhnAndEnte,
  ...rind,
  ...lamm,
  ...getränke,
  ...bierAndWein,
];

export const getProductId = (item: Menu) =>
  [item.number, item.name_german, item.name_chinese].join("-");

export const findMenuItem = (productId: string) =>
  menuItems.find((item) => getProductId(item) === productId);
