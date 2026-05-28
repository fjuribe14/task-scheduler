import { Job } from "@/jobs/base.job";

export class TipoCambioJob extends Job {
  constructor() {
    super({
      name: "TipoCambioJob",
      cronExpression: "*/10 * * * * *",
      handler: async () => {
        return;
      },
    });
  }
}
