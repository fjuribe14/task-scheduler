import "dotenv/config";
import { format } from "date-fns";
import type { TCambioCostosOperativosSchema } from "#/types/cambio_costos_operativos.js";
import type { TCambioMonedaSchema } from "#/types/cambio_moneda.types.js";
import type { DolarAPIRatesResponse } from "#/types/exchange/dolarapi.types.js";
import {
  dolarApiEndpointEnumObject,
  fuenteEnumObject,
} from "#/types/exchange/dolarapi.types.js";
import type { TTipoCambioSchema } from "#/types/tipo_cambio.types.js";

class DolarAPIService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = String(process.env.COTIZAVE_API_URL);

    if (!this.apiUrl) {
      throw new Error(
        "La variable de entorno COTIZAVE_API_URL no está definida.",
      );
    }
  }

  private async getDollarRates(): Promise<DolarAPIRatesResponse[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}${dolarApiEndpointEnumObject["/dolares"]}`,
      );
      return await response.json();
    } catch (error) {
      console.error("Error al obtener las tasas de cambio del dolar:", error);
      return [];
    }
  }

  private async getEuroRates(): Promise<DolarAPIRatesResponse[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}${dolarApiEndpointEnumObject["/euros"]}`,
      );
      return await response.json();
    } catch (error) {
      console.error("Error al obtener las tasas de cambio del euro:", error);
      return [];
    }
  }

  public async getRates(): Promise<DolarAPIRatesResponse[]> {
    try {
      const [dolarData, euroData] = await Promise.all([
        this.getDollarRates(),
        this.getEuroRates(),
      ]);

      return [...dolarData, ...euroData];
    } catch (error) {
      console.error("Error al obtener las tasas de cambio:", error);
      return [];
    }
  }

  public castToCambioMoneda(
    rates: DolarAPIRatesResponse[],
  ): TCambioMonedaSchema[] {
    if (!rates) return [];

    return rates.map((rate) => {
      return {
        id_pais: 0,
        fecha_fin: null,
        moneda: rate.moneda,
        valor_moneda: rate.promedio,
        fecha_inicio: format(rate.fechaActualizacion, "yyyy-MM-dd"),
      };
    });
  }

  public castToTipoCambio(rates: DolarAPIRatesResponse[]): TTipoCambioSchema[] {
    if (!rates) return [];

    return rates
      .filter((rate) => rate?.fuente?.includes(fuenteEnumObject.oficial))
      .map((rate) => {
        return {
          moneda: rate.moneda,
          valor: rate.promedio,
          fecha_valor: new Date(format(rate.fechaActualizacion, "yyyy-MM-dd")),
        };
      });
  }

  public castToCambioCostosOperativos(
    rates: DolarAPIRatesResponse[],
  ): TCambioCostosOperativosSchema[] {
    if (!rates) return [];

    return rates.map((rate) => {
      return {
        id_pais: 0,
        id_tipo_moneda: 1,
        hecho_por: "CRON",
        moneda: rate.moneda,
        modificado_por: "CRON",
        fecha_registro: new Date(),
        fecha_modificado: new Date(),
        valor_aplicable: rate.promedio,
        fecha_fin: new Date(format(rate.fechaActualizacion, "yyyy-MM-dd")),
        fecha_inicio: new Date(format(rate.fechaActualizacion, "yyyy-MM-dd")),
      };
    });
  }
}

export default new DolarAPIService();
