import { Job } from "#/jobs/base.job.js";
import cotizaveService from "#/services/exchange/cotizave.service.js";
import dolarapiService from "#/services/exchange/dolarapi.service.js";
import exchangeManagerService from "#/services/exchange/exchange_manager.service.js";
import type { TCambioCostosOperativosSchema } from "#/types/cambio_costos_operativos.js";
import type { TCambioMonedaSchema } from "#/types/cambio_moneda.types.js";
import type { TTipoCambioSchema } from "#/types/tipo_cambio.types.js";

export default class ExchangeRatesJob extends Job {
  constructor() {
    super({
      name: "ExchangeRatesJob",
      cronExpression: "*/10 * * * * *",
      handler: async () => {
        const { rates, ratesFallback } =
          await exchangeManagerService.getExchangeRates();

        if (!rates && !ratesFallback) {
          throw new Error(
            "[ExchangeRatesJob - handler]: No se pudieron obtener las tasas de cambio",
          );
        }

        console.log({ rates, ratesFallback });

        return;

        let tipoCambio: TTipoCambioSchema[] = [];
        let cambioMoneda: TCambioMonedaSchema[] = [];
        let cambioCostosOperativos: TCambioCostosOperativosSchema[] = [];

        if (rates) {
          tipoCambio = cotizaveService.castToTipoCambio(rates.rates ?? []);
          cambioMoneda = cotizaveService.castToCambioMoneda(rates.rates ?? []);
          cambioCostosOperativos = cotizaveService.castToCambioCostosOperativos(
            rates.rates ?? [],
          );
        }

        if (ratesFallback) {
          tipoCambio = dolarapiService.castToTipoCambio(ratesFallback);
          cambioMoneda = dolarapiService.castToCambioMoneda(ratesFallback);
          cambioCostosOperativos =
            dolarapiService.castToCambioCostosOperativos(ratesFallback);
        }

        console.log(tipoCambio);
        console.log(cambioMoneda);
        console.log(cambioCostosOperativos);
      },
    });
  }
}
