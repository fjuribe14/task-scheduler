import type { cambioMonedaSchema } from "#/schemas/mssql/cambio_moneda.schema.js";

export type TCambioMonedaSchema = typeof cambioMonedaSchema.$inferInsert;
