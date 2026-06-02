import "dotenv/config";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "#/config/database.js";
import { logger } from "#/config/logger.js";
import { tipoCambioSchema } from "#/schemas/mssql/tipo_cambio.schema.js";
import type { TTipoCambioSchema } from "#/types/tipo_cambio.types.js";

class TipoCambioService {
  private database;

  constructor() {
    this.database = db.mssql;
  }

  async checkExistenciaTipoCambio(data: TTipoCambioSchema[]) {
    if (!this.database) {
      throw Error(`[TipoCambioService] Database not initialized ❌`);
    }

    if (!data.length) {
      throw Error(`[TipoCambioService] Data is empty ❌`);
    }

    const fechaValor = data[0].fecha_valor;
    const monedas: string[] = data.map((item) => item.moneda);

    return await this.database
      .select()
      .from(tipoCambioSchema)
      .where(
        and(
          inArray(tipoCambioSchema.moneda, monedas),
          eq(tipoCambioSchema.fecha_valor, fechaValor),
        ),
      );
  }

  async update(data: TTipoCambioSchema[]): Promise<unknown> {
    logger.info("[TipoCambioService] Updating data 🔄");

    if (!this.database) {
      throw Error(`[TipoCambioService] Database not initialized ❌`);
    }

    if (!data.length) {
      throw Error(`[TipoCambioService] Data is empty ❌`);
    }

    const dataToUpdate = data.map((item) => {
      if (!item.moneda || !item.valor || !item.fecha_valor) {
        throw Error(`[TipoCambioService] Data is incomplete ❌`);
      }

      return {
        valor: item.valor,
        moneda: item.moneda,
        fecha_valor: item.fecha_valor,
      };
    });

    await Promise.all(
      dataToUpdate.map((item) =>
        this.database
          ?.update(tipoCambioSchema)
          .set({ valor: item.valor, fecha_modificacion: new Date() })
          .where(
            and(
              eq(tipoCambioSchema.moneda, item.moneda),
              eq(tipoCambioSchema.fecha_valor, item.fecha_valor),
            ),
          ),
      ),
    );

    return { message: "Data updated successfully ✅" };
  }

  async save(data: TTipoCambioSchema[]): Promise<unknown> {
    logger.info("[TipoCambioService] Saving data 💾");

    if (!this.database) {
      throw Error(`[TipoCambioService] Database not initialized ❌`);
    }

    if (!data.length) {
      throw Error(`[TipoCambioService] Data is empty ❌`);
    }

    const dataToInsert = data.map((item) => {
      if (!item.moneda || !item.valor || !item.fecha_valor) {
        throw Error(`[TipoCambioService] Data is incomplete ❌`);
      }

      return {
        valor: item.valor,
        moneda: item.moneda,
        fecha_valor: item.fecha_valor,
      };
    });

    return await this.database.transaction(
      async (tx) => await tx.insert(tipoCambioSchema).values(dataToInsert),
    );
  }

  async createOrUpdate(data: TTipoCambioSchema[]) {
    const existenciaTipoCambio = await this.checkExistenciaTipoCambio(data);

    if (existenciaTipoCambio.length) return await this.update(data);

    return await this.save(data);
  }
}

export default new TipoCambioService();
