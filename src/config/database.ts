import "dotenv/config";
import { createClient as createClientLibSql } from "@libsql/client";
import * as Sentry from "@sentry/node";
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
      const mssqlConfig: mssql.config = {
        server: String(process.env.DATABASE_HOST),
        database: String(process.env.DATABASE_NAME),
        user: String(process.env.DATABASE_USER),
        password: String(process.env.DATABASE_PASSWORD),
        options: {
          encrypt: true,
          trustServerCertificate: true,
          cryptoCredentialsDetails: {
            minVersion: "TLSv1",
          },
        },
      };

      const pool = await mssql.connect(mssqlConfig);
      db.mssql = drizzleMsSql({ client: pool });
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
      Sentry.captureException(error);
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
      Sentry.captureException(error);
      throw error;
    }
    break;
  }
}

export { db };
