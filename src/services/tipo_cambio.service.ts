import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { db } from "#/config/database.js";
import { tipoCambioSchema } from "#/schemas/sqlite/tipo_cambio.schema.js";
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

    return await this.database
      .select()
      .from(tipoCambioSchema)
      .where(
        and(
          eq(tipoCambioSchema.moneda, data[0].moneda),
          eq(tipoCambioSchema.fecha_valor, data[0].fecha_valor),
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
