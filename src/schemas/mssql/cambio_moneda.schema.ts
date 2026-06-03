import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cambioMonedaSchema = sqliteTable("cambio_moneda", {
  id_pais: int().notNull(),
  fecha_inicio: text().notNull(),
  fecha_fin: text(),
  valor_moneda: real().notNull(),
  id: int().primaryKey({ autoIncrement: true }),
  usuario: int(),
  valor_moneda_reconversion: real(),
  id_tipo_moneda: int().notNull(),
});
