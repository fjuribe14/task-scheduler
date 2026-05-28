import { Job } from "#/jobs/base.job.js";

export class TipoCambioJob extends Job {
  constructor() {
    super({
      name: "TipoCambioJob",
      cronExpression: "*/10 * * * * *",
      handler: async () => {
        throw new Error("Error al obtener el tipo de cambio");
      },
    });
  }
}
