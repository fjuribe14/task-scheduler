import { logger } from "@/config/logger";
import type { Job } from "@/jobs/base.job";
import { TipoCambioJob } from "@/jobs/tipo_cambio.job";

const jobs: Job[] = [new TipoCambioJob(), new TipoCambioJob()];

logger.info("Task scheduler started with %d job(s) 🏁", jobs.length);

for (const job of jobs) {
  logger.info("[%s] registered 📋", job.constructor.name);
  job.run();
}
