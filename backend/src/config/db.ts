// import "dotenv/config"
// import {drizzle} from  "drizzle-orm/node-postgres"
// import {Pool} from "pg"

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// })

// const db = drizzle({client: pool})

// export default db

import "dotenv/config"
import {neon} from "@neondatabase/serverless"
import {drizzle} from "drizzle-orm/neon-http"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle({client: sql})

export default db