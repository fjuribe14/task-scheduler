import cotizaveService from "#/services/exchange/cotizave.service.js";
import DolarAPIService from "#/services/exchange/dolarapi.service.js";
import type { TCotizaVeRatesResponse } from "#/types/exchange/cotizave.types.js";
import type { DolarAPIRatesResponse } from "#/types/exchange/dolarapi.types.js";

export type TGetExchangeRatesResponse = {
  rates?: TCotizaVeRatesResponse;
  ratesFallback?: DolarAPIRatesResponse[] | undefined;
};

class ExchangeManagerService {
  public async getExchangeRates(): Promise<TGetExchangeRatesResponse> {
    try {
      const rates = await cotizaveService.getRates();
      let ratesFallback: DolarAPIRatesResponse[] | undefined;

      if (!cotizaveService.isRatesValid(rates)) {
        ratesFallback = await DolarAPIService.getRates();
      }

      if (!rates && !ratesFallback) {
        throw new Error(
          "[ExchangeManagerService - getExchangeRates]: No se pudieron obtener las tasas de cambio",
        );
      }

      return { rates, ratesFallback };
    } catch (error) {
      console.error(
        "[ExchangeManagerService - getExchangeRates]: Error al obtener las tasas de cambio",
        error,
      );
      throw error;
    }
  }
}

export default new ExchangeManagerService();
