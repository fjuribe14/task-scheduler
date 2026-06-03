import { format } from "date-fns";
import { and, eq } from "drizzle-orm";
import { db } from "#/config/database.js";
import { cambioMonedaSchema } from "#/schemas/mssql/cambio_moneda.schema.js";
import type { TCambioMonedaSchema } from "#/types/cambio_moneda.types.js";
import { monedaEnumObject } from "#/types/moneda.types.js";
import type { TTipoCambioSchema } from "#/types/tipo_cambio.types.js";

type TCreateOrUpdateProps = {
  tipoCambio: TTipoCambioSchema[];
};
class CambioMonedaService {
  private database;

  constructor() {
    this.database = db.mssql;
  }

  private calculateAveragePrice(tipoCambio: TTipoCambioSchema[]): string {
    const value = tipoCambio.find(
      (tipoCambio) => tipoCambio.moneda === monedaEnumObject.USD,
    )?.valor;

    if (!value) throw Error("Value not found ❌");

    return value.toFixed(2);
  }

  private castToCambioMoneda(
    tipoCambio: TTipoCambioSchema[],
  ): TCambioMonedaSchema {
    return {
      // TODO: CAMBIAR ESTO POR CONSULTAS A BASE DE DATOS DE LOS PAISES Y MONEDAS, PARA QUE SE ENCUENTREN LOS ID CORRECTOS
      id_pais: 1,
      id_tipo_moneda: 5,
      fecha_inicio: format(new Date(), "yyyy-MM-dd"),
      valor_moneda: Number(this.calculateAveragePrice(tipoCambio)),
    };
  }

  private async checkExistencia(dataToInsert: TCambioMonedaSchema) {
    if (!this.database) throw Error("Database not initialized ❌");

    return await this.database
      .select()
      .from(cambioMonedaSchema)
      .where(
        and(
          eq(cambioMonedaSchema.id_pais, dataToInsert.id_pais),
          eq(cambioMonedaSchema.fecha_inicio, dataToInsert.fecha_inicio),
          eq(cambioMonedaSchema.id_tipo_moneda, dataToInsert.id_tipo_moneda),
        ),
      );
  }

  private async save(dataToInsert: TCambioMonedaSchema): Promise<unknown> {
    if (!this.database) throw Error("Database not initialized ❌");

    return await this.database.insert(cambioMonedaSchema).values(dataToInsert);
  }
  private async update(dataToInsert: TCambioMonedaSchema): Promise<unknown> {
    if (!this.database) throw Error("Database not initialized ❌");

    return await this.database
      .update(cambioMonedaSchema)
      .set(dataToInsert)
      .where(
        and(
          eq(cambioMonedaSchema.fecha_inicio, dataToInsert.fecha_inicio),
          eq(cambioMonedaSchema.id_tipo_moneda, dataToInsert.id_tipo_moneda),
        ),
      );
  }

  public async createOrUpdate(props: TCreateOrUpdateProps) {
    const { tipoCambio } = props;

    if (!this.database) throw Error("Database not initialized ❌");
    if (!tipoCambio.length) throw Error("Data tipo_cambio is empty ❌");

    const dataToInsert: TCambioMonedaSchema =
      this.castToCambioMoneda(tipoCambio);

    const existing = await this.checkExistencia(dataToInsert);

    if (existing.length) return await this.update(dataToInsert);

    return await this.save(dataToInsert);
  }
}

export default new CambioMonedaService();
