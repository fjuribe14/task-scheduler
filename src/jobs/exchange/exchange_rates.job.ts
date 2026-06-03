import "dotenv/config";
import { Job } from "#/jobs/base.job.js";
import cambioCostosOperativosService from "#/services/cambio_costos_operativos.service.js";
import cambioMonedaService from "#/services/cambio_moneda.service.js";
import cotizaveService from "#/services/exchange/cotizave.service.js";
import dolarapiService from "#/services/exchange/dolarapi.service.js";
import exchangeManagerService from "#/services/exchange/exchange_manager.service.js";
import type { TTipoCambioSchema } from "#/types/tipo_cambio.types.js";

export default class ExchangeRatesJob extends Job {
  constructor() {
    super({
      name: "ExchangeRatesJob",
      cronExpression: String(process.env.EXCHANGE_CRON),
      handler: async () => {
        try {
          const { rates, ratesFallback } =
            await exchangeManagerService.getExchangeRates();

          if (!rates && !ratesFallback) {
            throw new Error(
              "[ExchangeRatesJob - handler]: No se pudieron obtener las tasas de cambio",
            );
          }

          let tipoCambio: TTipoCambioSchema[] = [];

          if (rates) {
            tipoCambio = cotizaveService.castToTipoCambio(rates.rates ?? []);
          }

          if (ratesFallback) {
            tipoCambio = dolarapiService.castToTipoCambio(ratesFallback);
          }

          // await tipoCambioService.createOrUpdate(tipoCambio);

          await Promise.all([
            cambioMonedaService.createOrUpdate({ tipoCambio }),
            cambioCostosOperativosService.createOrUpdate({ tipoCambio }),
          ]);
        } catch (error) {
          throw new Error(String(error));
        }
      },
    });
  }
}
