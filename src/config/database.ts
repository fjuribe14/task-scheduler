import "dotenv/config";
import { createClient as createClientLibSql } from "@libsql/client";
import {
  drizzle as drizzleLibSql,
  type LibSQLDatabase,
} from "drizzle-orm/libsql";
import {
  drizzle as drizzleMsSql,
  type NodeMsSqlDatabase,
} from "drizzle-orm/node-mssql";
import mssql from "mssql";

const db: {
  mssql?: NodeMsSqlDatabase;
  sqlite?: LibSQLDatabase;
} = {
  mssql: undefined,
  sqlite: undefined,
};

const dataBaseProvider = process.env.DATABASE_PROVIDER;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("La variable de entorno DATABASE_URL no está definida.");
}

if (!dataBaseProvider) {
  throw new Error("La variable de entorno DATABASE_PROVIDER no está definida.");
}

switch (dataBaseProvider) {
  case "mssql": {
    try {
      const pool = await mssql.connect({
        server: "50.62.180.159",
        database: "qualitasassistance_com_sql",
        user: "qa_app",
        password: "h1Si2%Q80iEr",
        options: {
          encrypt: true,
          trustServerCertificate: true,
          cryptoCredentialsDetails: {
            minVersion: "TLSv1",
          },
        },
      });
      db.mssql = drizzleMsSql({ client: pool });
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
      throw error;
    }
    break;
  }

  default: {
    try {
      const client = createClientLibSql({ url: connectionString });
      db.sqlite = drizzleLibSql({ client });
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
      throw error;
    }
    break;
  }
}

export { db };
