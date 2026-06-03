import { getEnumObjectFromArray } from "#/utils/index.js";

const monedas = ["EUR", "USD", "USDC"] as const;

export type TMoneda = (typeof monedaEnumObject)[keyof typeof monedaEnumObject];

export const monedaEnumObject = getEnumObjectFromArray(monedas);
