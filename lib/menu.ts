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

const findBaseMenuItem = (productId: string) =>
  menuItems.find((item) => {
    const baseProductId = getProductId(item);

    return productId === baseProductId || productId.startsWith(`${baseProductId}-`);
  });

export const findMenuItem = (productId: string) => findBaseMenuItem(productId);

export const getProductDetails = (productId: string) => {
  const menuItem = findBaseMenuItem(productId);

  if (!menuItem) {
    return { menuItem: undefined, subType: undefined };
  }

  const baseProductId = getProductId(menuItem);
  const subTypeName = productId.startsWith(`${baseProductId}-`)
    ? productId.slice(baseProductId.length + 1)
    : undefined;

  return {
    menuItem,
    subType: menuItem.sub_type?.find((subType) => subType.name === subTypeName)
  };
};
