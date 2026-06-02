import path from "node:path";
import pino from "pino";
import { getCurrentDate } from "#/utils/index.js";

// const isProduction = process.env.NODE_ENV === "production";

const transport = pino.transport({
  level: process.env.LOG_LEVEL || "info",
  target: "pino-pretty",
  options: {
    sync: true,
    mkdir: true,
    maxRetries: 3,
    retryDelay: 50,
    colorize: true,
    ignore: "pid,hostname",
    destination: path.resolve(process.cwd(), "logs", `${getCurrentDate()}.log`),
  },
  // targets: [
  //   {
  //     target: "pino/file",
  //     options: {
  //       destination: `./logs/${getCurrentDate()}.log`,
  //     },
  //   },
  //   {
  //     target: "pino-pretty",
  //     options: {
  //       colorize: true,
  //       ignore: "pid,hostname",
  //     },
  //   },
  // ],
});
// {
//   level: process.env.LOG_LEVEL || "info",
//   formatters: {
//     level: (label) => {
//       return { level: label.toUpperCase() };
//     },
//   },
//   timestamp: pino.stdTimeFunctions.isoTime,
//   transport: !isProduction
//     ? {
//         target: "pino-pretty",
//         options: {
//           colorize: true,
//           ignore: "pid,hostname",
//         },
//       }
//     : undefined,
// },
// pino.destination(`./logs/${getCurrentDate()}.log`),

export const logger = pino(transport);
