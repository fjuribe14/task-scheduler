// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://eeab9844d0dbfd0f1dd308c6eb3796d4@o4511501536460800.ingest.us.sentry.io/4511501538361344",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
