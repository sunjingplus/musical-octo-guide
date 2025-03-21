import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.js",
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL
  },
});
