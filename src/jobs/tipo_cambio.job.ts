import { logger } from "#/config/logger.js";
import { Job } from "#/jobs/base.job.js";
// import cotizaveService from "#/services/cotizave.service.js";
// import tipoCambioService from "#/services/tipo_cambio.service.js";

export class TipoCambioJob extends Job {
  constructor() {
    super({
      name: "TipoCambioJob",
      cronExpression: process.env.COTIZAVE_BCV_CRON || "*/5 * * * * *",
      handler: async () => {
        logger.info(`[${this.name}] Running...`);

        // try {
        //   const { rates } = await cotizaveService.getRates();
        //   const data = cotizaveService?.castToTipoCambio(rates);
        //   if (!data) return logger.info(`[${this.name}] No data to save ❌`);
        //   const checkDataExists =
        //     await tipoCambioService.checkExistenciaTipoCambio(data);
        //   if (checkDataExists.length) {
        //     return logger.info(`[${this.name}] Data already exists ✅`);
        //   }
        //   await tipoCambioService.save(data);
        //   logger.info(`[${this.name}] Data saved successfully ✅`);
        // } catch (error) {
        //   logger.error(`[${this.name}] Failed to save data ❌`);
        //   logger.error(error);
        // }
      },
    });
  }
}
