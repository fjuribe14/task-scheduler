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

// CREATE TABLE qualitasassistance_com_sql.dbo.cambio_costos_operativos (
// 	id int IDENTITY(1,1) NOT NULL,
// 	id_pais int NULL,
// 	fecha_inicio datetime NULL,
// 	fecha_fin datetime NULL,
// 	valor_aplicable float NULL,
// 	id_tipo_moneda int NULL,
// 	hecho_por varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
// 	fecha_registro datetime DEFAULT getdate() NULL,
// 	modificado_por varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
// 	fecha_modificado datetime NULL,
// 	CONSTRAINT PK__cambio_c__3213E83F1C8E8C4E PRIMARY KEY (id)
// );
