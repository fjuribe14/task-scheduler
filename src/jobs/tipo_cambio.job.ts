import { logger } from "#/config/logger.js";
import { Job } from "#/jobs/base.job.js";
import exchange_managerService from "#/services/exchange/exchange_manager.service.js";

export class TipoCambioJob extends Job {
  constructor() {
    super({
      name: "TipoCambioJob",
      cronExpression: "*/30 * * * * *",
      handler: async () => {
        try {
          const { rates, ratesFallback } =
            await exchange_managerService.getExchangeRates();

          if (!rates && !ratesFallback) {
            throw new Error(
              "[ExchangeRatesJob - handler]: No se pudieron obtener las tasas de cambio",
            );
          }

          console.log({ rates, ratesFallback });
          // const checkDataExists =
          //   await tipo_cambioService.checkExistenciaTipoCambio(data);
          // if (checkDataExists.length) {
          //   return logger.info(`[${this.name}] Data already exists ✅`);
          // }
          // await tipo_cambioService.save(data);
          logger.info(`[${this.name}] Data saved successfully ✅`);
        } catch (error) {
          logger.error(`[${this.name}] Failed to save data ❌`);
          logger.error(error);
        }
      },
    });
  }
}
