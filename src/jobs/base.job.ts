import { CronJob } from "cron";
import { logger } from "#/config/logger.js";
import type { TJob } from "#/types/job.types.js";

export class Job {
  protected name: string;
  protected cronExpression: string;
  protected handler: () => Promise<void>;

  constructor({ name, cronExpression, handler }: TJob) {
    if (!name) throw new Error("Job must have a name");
    if (!cronExpression) throw new Error("Job must have a cronExpression");
    if (!handler) throw new Error("Job must have a handler");

    this.name = name;
    this.cronExpression = cronExpression;
    this.handler = handler;
  }

  run() {
    new CronJob(
      this.cronExpression,
      () => {
        logger.info(`[${this.name}] started 🚚`);
        this.handler()
          .then(() => {
            logger.info(`[${this.name}] completed ✅`);
          })
          .catch((error) => {
            logger.error(`[${this.name}] failed ❌`, error);
          });
      },
      null,
      true,
      "America/Guatemala",
    );
  }
}
