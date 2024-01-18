import { ConnectionOptions, createConnection } from "mysql2/promise";

export function createDb() {
  const opts: ConnectionOptions = {
    connectionLimit: 20,
    host: process.env.HOST as string,
    user: process.env.USER as string,
    database: process.env.DATABASE as string,
    password: process.env.PASSWORD as string,
  };
  console.log(opts);
  return createConnection(opts);
}
