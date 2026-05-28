import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tipoCambioSchema = sqliteTable("tipo_cambio", {
  id: int().primaryKey({ autoIncrement: true }),
  moneda: text({ length: 3 }).notNull(),
  valor: real().notNull(),
  fecha: text().notNull(),
  fecha_creacion: text().default(new Date().toISOString()).notNull(),
  fecha_actualizacion: text().default(new Date().toISOString()).notNull(),
});
