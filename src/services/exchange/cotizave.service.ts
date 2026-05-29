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
import { monedaEnumObject } from "#/types/moneda.types.js";
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
      id_pais: 1,
      valor_moneda: rate.mid,
      valor_moneda_reconversion: rate.bid,
      fecha_inicio: String(rate.updated_at),
    }));
  }

  public castToCambioCostosOperativos(
    rates: TCotizaVeRatesResponseRate[],
  ): TCambioCostosOperativosSchema[] {
    return rates.map((rate) => ({
      id_pais: 1,
      hecho_por: "CRON",
      id_tipo_moneda: 1,
      modificado_por: "CRON",
      valor_aplicable: Number(rate.bid),
      fecha_fin: new Date(format(String(rate.updated_at), "yyyy-MM-dd")),
      fecha_inicio: new Date(format(String(rate.updated_at), "yyyy-MM-dd")),
      fecha_registro: new Date(format(String(rate.updated_at), "yyyy-MM-dd")),
      fecha_modificado: new Date(format(String(rate.updated_at), "yyyy-MM-dd")),
    }));
  }

  public castToTipoCambio(
    rates?: TCotizaVeRatesResponseRate[],
  ): TTipoCambioSchema[] {
    if (!rates) return [];

    return rates
      .filter((rate) =>
        rate?.type?.includes(cotizaVeRatesResponseTypeEnumObject.reference),
      )
      .map((rate) => {
        const moneda = rate?.market?.includes(
          cotizaVeRatesResponseMarketEnumObject.eur_reference,
        )
          ? monedaEnumObject.EUR
          : monedaEnumObject.USD;

        return {
          moneda,
          valor: rate?.mid,
          fecha_valor: new Date(format(String(rate?.updated_at), "yyyy-MM-dd")),
        };
      });
  }
}

export default new CotizaVeService();
