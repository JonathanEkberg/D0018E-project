import { ConnectionOptions, createConnection } from "mysql2/promise";

export function createDb() {
  const opts: ConnectionOptions = {
    connectionLimit: 20,
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    database: process.env.DB_DATABASE as string,
    password: process.env.DB_PASSWORD as string,
  };
  console.log(opts);
  return createConnection(opts);
}
