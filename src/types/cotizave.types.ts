import { getEnumObjectFromArray } from "#/utils/index.js";

export type TCotizaVeRatesResponse = {
  country?: string;
  currency?: string;
  base?: string;
  rates?: TCotizaVeRatesResponseRate[];
  fetched_at?: Date;
};

export type TCotizaVeRatesResponseRate = {
  market: TCotizaVeRatesResponseMarket;
  type: TCotizaVeRatesResponseType;
  mid: number;
  updated_at?: Date;
  ask?: number;
  bid?: number;
};

const cotizaVeRatesResponseMarketEnum = [
  "reference",
  "eur_reference",
  "parallel",
  "binance",
] as const;

const cotizaVeRatesResponseTypeEnum = ["p2p", "reference", "parallel"] as const;

export type TCotizaVeRatesResponseMarket =
  (typeof cotizaVeRatesResponseMarketEnum)[number];
export type TCotizaVeRatesResponseType =
  (typeof cotizaVeRatesResponseTypeEnum)[number];

export const cotizaVeRatesResponseMarketEnumObject = getEnumObjectFromArray(
  cotizaVeRatesResponseMarketEnum,
);
export const cotizaVeRatesResponseTypeEnumObject = getEnumObjectFromArray(
  cotizaVeRatesResponseTypeEnum,
);
