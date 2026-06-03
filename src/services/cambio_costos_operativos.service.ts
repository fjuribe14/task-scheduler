import { format } from "date-fns";
import { and, eq } from "drizzle-orm";
import { db } from "#/config/database.js";
import { cambioCostosOperativosSchema } from "#/schemas/mssql/cambio_costos_operativos.schema.js";
import type { TCambioCostosOperativosSchema } from "#/types/cambio_costos_operativos.js";
import { monedaEnumObject } from "#/types/moneda.types.js";
import type { TTipoCambioSchema } from "#/types/tipo_cambio.types.js";

type TCreateOrUpdateProps = {
  tipoCambio: TTipoCambioSchema[];
};
class CambioCostosOperativosService {
  private database;

  constructor() {
    this.database = db.mssql;
  }

  private calculateAveragePrice(tipoCambio: TTipoCambioSchema[]): string {
    const filteredTipoCambio = tipoCambio
      .filter(
        (tipoCambio) =>
          tipoCambio.moneda === monedaEnumObject.USDC ||
          tipoCambio.moneda === monedaEnumObject.EUR,
      )
      .map(({ valor }) => valor);

    const average_price = (
      filteredTipoCambio
        .filter((value) => value !== null)
        .reduce((acc, value) => acc + value, 0) / filteredTipoCambio.length
    ).toFixed(2);

    return average_price;
  }

  private castToCambioCostosOperativos(
    tipoCambio: TTipoCambioSchema[],
  ): TCambioCostosOperativosSchema {
    // biome-ignore lint/style/noNonNullAssertion: False positive
    const fecha_registro = tipoCambio[0].fecha_registro!;

    return {
      id_pais: 1,
      hecho_por: "CRON",
      id_tipo_moneda: 5,
      modificado_por: "CRON",
      fecha_modificado: new Date(),
      valor_aplicable: Number(this.calculateAveragePrice(tipoCambio)),
      fecha_inicio: new Date(format(fecha_registro, "yyyy-MM-dd")),
    };
  }

  private async checkExistencia(dataToInsert: TCambioCostosOperativosSchema) {
    if (!this.database) throw Error("Database not initialized ❌");

    return await this.database
      .select()
      .from(cambioCostosOperativosSchema)
      .where(
        and(
          eq(cambioCostosOperativosSchema.id_pais, dataToInsert.id_pais),
          eq(
            cambioCostosOperativosSchema.fecha_inicio,
            dataToInsert.fecha_inicio,
          ),
          eq(
            cambioCostosOperativosSchema.id_tipo_moneda,
            dataToInsert.id_tipo_moneda,
          ),
        ),
      );
  }

  private async save(
    dataToInsert: TCambioCostosOperativosSchema,
  ): Promise<unknown> {
    if (!this.database) throw Error("Database not initialized ❌");

    return await this.database
      .insert(cambioCostosOperativosSchema)
      .values(dataToInsert);
  }

  private async update(
    dataToInsert: TCambioCostosOperativosSchema,
  ): Promise<unknown> {
    if (!this.database) throw Error("Database not initialized ❌");

    return await this.database
      .update(cambioCostosOperativosSchema)
      .set(dataToInsert)
      .where(
        and(
          eq(
            cambioCostosOperativosSchema.fecha_inicio,
            dataToInsert.fecha_inicio,
          ),
          eq(
            cambioCostosOperativosSchema.id_tipo_moneda,
            dataToInsert.id_tipo_moneda,
          ),
        ),
      );
  }

  public async createOrUpdate(props: TCreateOrUpdateProps) {
    const { tipoCambio } = props;

    if (!this.database) throw Error("Database not initialized ❌");
    if (!tipoCambio.length) throw Error("Data tipo_cambio is empty ❌");

    const dataToInsert: TCambioCostosOperativosSchema =
      this.castToCambioCostosOperativos(tipoCambio);

    const existing = await this.checkExistencia(dataToInsert);

    if (existing.length) return await this.update(dataToInsert);

    return await this.save(dataToInsert);
  }
}

export default new CambioCostosOperativosService();
