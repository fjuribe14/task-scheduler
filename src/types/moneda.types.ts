import { getEnumObjectFromArray } from "#/utils/index.js";

const monedas = ["EUR", "USD"] as const;

export type TMoneda = (typeof monedaEnumObject)[keyof typeof monedaEnumObject];

export const monedaEnumObject = getEnumObjectFromArray(monedas);
