import "dotenv/config";
import { format } from "date-fns";
import type { TCambioMonedaSchema } from "#/types/cambio_moneda.types.js";
import {
  cotizaVeRatesResponseMarketEnumObject,
  cotizaVeRatesResponseTypeEnumObject,
  type TCotizaVeRatesResponse,
  type TCotizaVeRatesResponseRate,
} from "#/types/cotizave.types.js";
import { monedasEnumObject } from "#/types/moneda.types.js";
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

  public async getRates(): Promise<Partial<TCotizaVeRatesResponse>> {
    const response = await fetch(`${this.apiUrl}/rates`, {
      headers: {
        "X-API-Key": this.apiKey,
        Accept: "application/json",
      },
    });

    return await response.json();
  }

  public castToCambioMoneda(
    rates: TCotizaVeRatesResponseRate[],
  ): Partial<TCambioMonedaSchema>[] {
    return rates.map((rate) => ({
      valor_moneda: rate.mid,
      fecha_inicio: String(rate.updated_at),
      valor_moneda_reconversion: rate.bid,
      id_pais: 1,
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
          ? monedasEnumObject.EUR
          : monedasEnumObject.USD;

        return {
          moneda,
          valor: rate?.mid,
          fecha_valor: new Date(format(String(rate?.updated_at), "yyyy-MM-dd")),
        };
      });
  }
}

export default new CotizaVeService();
