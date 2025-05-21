const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

let config = {};

if (ENV === "production") {
  const params = new URL(process.env.DATABASE_URL);

  config = {
    user: params.username,
    password: params.password,
    host: params.hostname,
    database: params.pathname.slice(1),
    port: params.port,
    max: 2,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

module.exports = new Pool(config);
