import { Job } from "#/jobs/base.job.js";
import TipoCambioService from "#/services/tipo_cambio.service.js";

export class TipoCambioJob extends Job {
  constructor() {
    super({
      name: "TipoCambioJob",
      cronExpression: "*/10 * * * * *",
      handler: async () => {
        await TipoCambioService.findTipoCambioBcv();
        // await TipoCambioService.findTipoCambioPromedio();
      },
    });
  }
}
