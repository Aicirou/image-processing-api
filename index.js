import express, { json } from "express"
import { config } from "dotenv"

import pool from "./src/config/db.js"
import createRequestTable from "./src/tables/Request.js"
import Routes from "./src/routes/index.js"

// Load environment variables
config()

const app = express()

// Connect to the database
pool.connect((err) => {
  if (err) {
    console.error("connection error", err)
    return
  }
  console.log("Connected to database")
})

// Create the "Requests" table if it doesn't exist
createRequestTable(pool)

app.use(json())

app.use(Routes)

// Remove `app.listen()`
// Export the app for serverless function handling
export default app
