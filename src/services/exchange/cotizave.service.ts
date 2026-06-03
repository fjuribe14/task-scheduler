import "dotenv/config";
import { format } from "date-fns";
import type { TCambioCostosOperativosSchema } from "#/types/cambio_costos_operativos.js";
import type { TCambioMonedaSchema } from "#/types/cambio_moneda.types.js";
import {
  cotizaVeEndpointEnumObject,
  cotizaVeRatesResponseMarketEnumObject,
  cotizaVeRatesResponseTypeEnumObject,
  type TCotizaVeRatesResponse,
  type TCotizaVeRatesResponseRate,
} from "#/types/exchange/cotizave.types.js";
import { monedaEnumObject, type TMoneda } from "#/types/moneda.types.js";
import type { TTipoCambioSchema } from "#/types/tipo_cambio.types.js";

class CotizaVeService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = String(process.env.COTIZAVE_API_URL);
    this.apiKey = String(process.env.COTIZAVE_API_KEY);

    if (!this.apiUrl) {
      throw new Error(
        "La variable de entorno COTIZAVE_API_URL no está definida.",
      );
    }

    if (!this.apiKey) {
      throw new Error(
        "La variable de entorno COTIZAVE_API_KEY no está definida.",
      );
    }
  }

  public async getRates(): Promise<TCotizaVeRatesResponse> {
    try {
      const response = await fetch(
        `${this.apiUrl}${cotizaVeEndpointEnumObject["/rates"]}`,
        {
          headers: {
            "X-API-Key": this.apiKey,
            Accept: "application/json",
          },
        },
      );

      return await response.json();
    } catch (error) {
      console.error(
        "[CotizaVeService - getRates]: Error al obtener las tasas de cambio",
        error,
      );
      return {};
    }
  }

  public isRatesValid({ rates }: TCotizaVeRatesResponse): boolean {
    return Boolean(rates && rates?.length > 0);
  }

  public castToCambioMoneda(
    rates: TCotizaVeRatesResponseRate[],
  ): TCambioMonedaSchema[] {
    return rates.map((rate) => ({
      // TODO: CAMBIAR ESTO POR CONSULTAS A BASE DE DATOS DE LOS PAISES Y MONEDAS, PARA QUE SE ENCUENTREN LOS ID CORRECTOS
      id_pais: 1,
      id_tipo_moneda: 5,
      valor_moneda: rate.mid,
      valor_moneda_reconversion: rate.bid,
      fecha_inicio: new Date(
        format(String(rate.updated_at), "yyyy-MM-dd"),
      ).toDateString(),
    }));
  }

  public castToCambioCostosOperativos(
    rates: TCotizaVeRatesResponseRate[],
  ): TCambioCostosOperativosSchema[] {
    if (!rates) return [];

    const ratesFiltered = rates.filter(
      (rate) =>
        rate?.type?.includes(cotizaVeRatesResponseTypeEnumObject.reference) ||
        rate?.market?.includes(cotizaVeRatesResponseMarketEnumObject.binance),
    );

    return ratesFiltered.map((rate) => ({
      // TODO: CAMBIAR ESTO POR CONSULTAS A BASE DE DATOS DE LOS PAISES Y MONEDAS, PARA QUE SE ENCUENTREN LOS ID CORRECTOS
      id_pais: 1,
      hecho_por: "CRON",
      id_tipo_moneda: 5,
      modificado_por: "CRON",
      valor_aplicable: Number(rate.bid),
      fecha_fin: new Date(format(String(rate.updated_at), "yyyy-MM-dd")),
      fecha_inicio: new Date(format(String(rate.updated_at), "yyyy-MM-dd")),
      fecha_modificado: new Date(format(String(rate.updated_at), "yyyy-MM-dd")),
    }));
  }

  public castToTipoCambio(
    rates?: TCotizaVeRatesResponseRate[],
  ): TTipoCambioSchema[] {
    if (!rates) return [];

    const ratesFiltered = rates.filter(
      (rate) =>
        rate?.type?.includes(cotizaVeRatesResponseTypeEnumObject.reference) ||
        rate?.market?.includes(cotizaVeRatesResponseMarketEnumObject.binance),
    );
    return ratesFiltered
      .filter(
        (rate) =>
          rate?.type?.includes(cotizaVeRatesResponseTypeEnumObject.reference) ||
          rate?.market?.includes(cotizaVeRatesResponseMarketEnumObject.binance),
      )
      .map(({ market, mid, updated_at }) => {
        let moneda: TMoneda = monedaEnumObject.USD;

        if (market === cotizaVeRatesResponseMarketEnumObject.eur_reference) {
          moneda = monedaEnumObject.EUR;
        }

        if (market === cotizaVeRatesResponseMarketEnumObject.binance) {
          moneda = monedaEnumObject.USDC;
        }

        return {
          moneda,
          valor: mid,
          fecha_valor: new Date(format(String(updated_at), "yyyy-MM-dd")),
        };
      });
  }
}

export default new CotizaVeService();
