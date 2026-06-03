import {
  bit,
  char,
  date,
  int,
  mssqlTable,
  nvarchar,
} from "drizzle-orm/mssql-core";
import type { TMoneda } from "#/types/moneda.types.js";

export const tipoMonedaSchema = mssqlTable("tipo_moneda", {
  id: int().identity().primaryKey(),
  nombre: nvarchar("nombre", { length: 100 }).notNull(),
  codigo: char("codigo", { length: 10 }).$type<TMoneda>().notNull(),
  simbolo: char("simbolo", { length: 10 }).notNull(),
  status: bit("status").default(false).notNull(),
  fecha_inicio: date("fecha_inicio").notNull(),
  fecha_fin: date("fecha_fin").notNull(),
});
