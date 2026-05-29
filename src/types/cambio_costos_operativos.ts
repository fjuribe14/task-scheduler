import type { cambioCostosOperativosSchema } from "#/schemas/mssql/cambio_costos_operativos.schema.js";

export type TCambioCostosOperativosSchema =
  typeof cambioCostosOperativosSchema.$inferInsert;
