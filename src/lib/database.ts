import type { ConnectionOptions, Pool } from "mysql2/promise"
import { createPool } from "mysql2/promise"

const opts: ConnectionOptions = {
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  database: process.env.DB_DATABASE as string,
  password: process.env.DB_PASSWORD as string,
  // Pooling settings from example https://sidorares.github.io/node-mysql2/docs#using-connection-pools
  waitForConnections: true,
  connectionLimit: 10,
  idleTimeout: 60_000,
  maxIdle: 10,
  queueLimit: 0,
  keepAliveInitialDelay: 0,
}

// console.log()
// console.log()
// console.log("################################")
// console.log("OPTIONS:")
// console.log(opts)
// console.log("################################")
// console.log()
// console.log()

declare global {
  var pool: Pool | undefined
}

const pool = global.pool || createPool(opts)

// Ensure we only create one pool during development between hot reloads https://nextjs.org/docs/architecture/fast-refresh
if (process.env.NODE_ENV !== "production") {
  global.pool = pool
}

export { pool }
