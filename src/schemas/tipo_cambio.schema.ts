import {
  datetime2,
  float,
  int,
  mssqlTable,
  nvarchar,
} from "drizzle-orm/mssql-core";

export const tipoCambioSchema = mssqlTable("tipo_cambio", {
  id: int("id").identity().primaryKey(),
  moneda: nvarchar("moneda", { length: 5 }).notNull(),
  valor: float("valor").notNull(),
  fecha_valor: datetime2("fecha_valor").notNull(),
  fecha_registro: datetime2("fecha_registro").default(new Date()).notNull(),
  fecha_modificacion: datetime2("fecha_modificacion")
    .default(new Date())
    .notNull(),
});
