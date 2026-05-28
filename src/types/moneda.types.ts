import { getEnumObjectFromArray } from "#/utils/index.js";

export type TMonedaSchema =
  (typeof monedasEnumObject)[keyof typeof monedasEnumObject];

const monedas = ["EUR", "USD"] as const;

export const monedasEnumObject = getEnumObjectFromArray(monedas);
