import { db } from "#/config/database.js";
import { tipoCambioSchema } from "#/schemas/tipo_cambio.schema.js";

export class TipoCambioService {
  async save(data: typeof tipoCambioSchema.$inferInsert) {
    return await db
      .insert(tipoCambioSchema)
      .values(data)
      .then((res) => res)
      .catch((err) => {
        throw err;
      });
  }
}
