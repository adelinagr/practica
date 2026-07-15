import pino from "pino";

// Define the PII fields we want to redact
const redactPaths = [
  "req.headers.cookie",
  "req.headers.authorization",
  "req.headers['x-api-key']",
  "user.email",
  "user.password",
  "email",
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "address",
  "phone",
];

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: {
    paths: redactPaths,
    censor: "[REDACTED]",
  },
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined, // In production, we log structured JSON to stdout
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});
