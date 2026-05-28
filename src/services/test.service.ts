import { db } from "#/config/database.js";

class TestService {
  private database = db.mssql;

  public async getCambioMoneda() {
    if (!this.database) return [];
    const result = await this.database.execute(
      "SELECT TOP (5) * FROM cambio_moneda",
    );
    return result;
  }
}

export default new TestService();
