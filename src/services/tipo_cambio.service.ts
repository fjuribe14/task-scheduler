import "dotenv/config";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "#/config/database.js";
import { tipoCambioSchema } from "#/schemas/mssql/tipo_cambio.schema.js";
import type { TTipoCambioSchema } from "#/types/tipo_cambio.types.js";

class TipoCambioService {
  private database;

  constructor() {
    this.database = db.mssql;
  }

  async findTipoCambioBcv(): Promise<void> {
    throw Error("Method 'findTipoCambioBcv' not implemented.");
  }

  async findTipoCambioPromedio(): Promise<void> {
    throw Error("Method 'findTipoCambioPromedio' not implemented.");
  }

  async checkExistenciaTipoCambio(data: TTipoCambioSchema[]) {
    if (!this.database) {
      throw Error(`[TipoCambioService] Database not initialized ❌`);
    }

    if (!data.length) {
      throw Error(`[TipoCambioService] Data is empty ❌`);
    }

    const monedas: string[] = data.map((item) => item.moneda);
    const values: number[] = data.map((item) => item.valor);
    const fechaValor = data[0].fecha_valor;

    return await this.database
      .select()
      .from(tipoCambioSchema)
      .where(
        and(
          inArray(tipoCambioSchema.valor, values),
          inArray(tipoCambioSchema.moneda, monedas),
          eq(tipoCambioSchema.fecha_valor, fechaValor),
        ),
      );
  }

  async save(data: Partial<TTipoCambioSchema>[]) {
    if (!this.database) {
      throw Error(`[TipoCambioService] Database not initialized ❌`);
    }

    if (!data.length) {
      throw Error(`[TipoCambioService] Data is empty ❌`);
    }

    return await this.database.transaction(async (tx) => {
      return await tx.insert(tipoCambioSchema).values(
        data.map((item) => {
          // TODO: move this validation to other function
          if (!item.moneda || !item.valor || !item.fecha_valor) {
            throw Error(`[TipoCambioService] Data is incomplete ❌`);
          }
          return {
            valor: item.valor,
            moneda: item.moneda,
            fecha_valor: item.fecha_valor,
          };
        }),
      );
    });
  }
}

export default new TipoCambioService();
