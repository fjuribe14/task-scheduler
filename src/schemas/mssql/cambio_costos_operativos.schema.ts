import {
  datetime2,
  float,
  int,
  mssqlTable,
  nvarchar,
} from "drizzle-orm/mssql-core";

export const cambioCostosOperativosSchema = mssqlTable(
  "cambio_costos_operativos",
  {
    id: int().identity().primaryKey(),
    id_pais: int().notNull(),
    fecha_inicio: datetime2("fecha_inicio").notNull(),
    fecha_fin: datetime2("fecha_fin").notNull(),
    valor_aplicable: float("valor_aplicable").notNull(),
    id_tipo_moneda: int().notNull(),
    hecho_por: nvarchar("hecho_por", { length: 20 }).notNull(),
    fecha_registro: datetime2("fecha_registro").default(new Date()).notNull(),
    modificado_por: nvarchar("modificado_por", { length: 20 }).notNull(),
    fecha_modificado: datetime2("fecha_modificado")
      .default(new Date())
      .notNull(),
  },
);
