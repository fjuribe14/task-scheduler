import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schemas/*.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: String(process.env.DATABASE_URL),
  },
});
