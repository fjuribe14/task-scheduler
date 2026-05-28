import { logger } from "#/config/logger.js";
import type { Job } from "#/jobs/base.job.js";
import { TipoCambioJob } from "#/jobs/tipo_cambio.job.js";

const jobs: Job[] = [new TipoCambioJob()];

logger.info("Task scheduler started with %d job(s) 🏁", jobs.length);

for (const job of jobs) {
  logger.info("[%s] registered 📋", job.constructor.name);
  job.run();
}
