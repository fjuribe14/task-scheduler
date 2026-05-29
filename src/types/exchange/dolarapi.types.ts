import type { TMoneda } from "#/types/moneda.types.js";
import { getEnumObjectFromArray } from "#/utils/index.js";

export type DolarAPIRatesResponse = {
  moneda: TMoneda;
  fuente: TFuente;
  nombre: string;
  compra: number;
  venta: number;
  promedio: number;
  fechaActualizacion: Date;
};

export const dolarApiEndpointEnum = [
  "/cotizaciones",
  "/dolares",
  "/euros",
] as const;

export const fuenteEnum = ["oficial", "paralelo"] as const;

export type TDolarApiEndpoint = (typeof dolarApiEndpointEnum)[number];

export const dolarApiEndpointEnumObject =
  getEnumObjectFromArray(dolarApiEndpointEnum);

export type TFuente = (typeof fuenteEnum)[number];

export const fuenteEnumObject = getEnumObjectFromArray(fuenteEnum);
