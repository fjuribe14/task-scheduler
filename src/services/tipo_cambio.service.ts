import "dotenv/config";
import { type Browser, type BrowserContext, chromium } from "playwright";
import { db } from "#/config/database.js";
import { logger } from "#/config/logger.js";
import { tipoCambioSchema } from "#/schemas/tipo_cambio.schema.js";

// type TipoCambio = typeof tipoCambioSchema.$inferInsert;

class TipoCambioService {
  browser?: Browser;

  async getBrowserContext(baseURL: string): Promise<BrowserContext> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    return await this.browser?.newContext({ baseURL });
  }

  async findTipoCambioBcv(): Promise<void> {
    try {
      // const elementsIds = ["euro", "yuan", "rublo", "lira", "dolar"];

      this.browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const context = await this.browser.newContext({
        baseURL: String(process.env.SCRAPPING_URL_TIPO_CAMBIO_BCV),
      });

      const page = await context.newPage();

      await page.goto("/", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      const html = await page.locator("html").innerHTML();
      console.log("@html", html);

      // for (const elementId of elementsIds) {
      //   console.log("@elementId", elementId);

      //   const title = await page.locator(`div[id="${elementId}"]`).innerText();
      //   logger.info(title);
      // }
    } catch (error) {
      logger.error(error);
      throw Error("Error al obtener el tipo de cambio");
    } finally {
      await this.browser?.close();
    }
  }

  async findTipoCambioPromedio(): Promise<void> {
    try {
      const context = await this.getBrowserContext(
        String(process.env.SCRAPPING_URL_TIPO_CAMBIO_PROMEDIO),
      );

      const page = await context.newPage();

      await page.goto("/tasas", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // const title = await page.locator("Dólar").innerText();
      const cards = await page.$$('[data-slot="card"]');

      for (const card of cards) {
        const title = await card.innerText();
        logger.info(title);
      }
    } catch (error) {
      logger.error(error);
      throw Error("Error al obtener el tipo de cambio");
    } finally {
      await this.browser?.close();
    }
  }

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

export default new TipoCambioService();
