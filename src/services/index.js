import express, { json } from "express"
import { config } from "dotenv"

import pool from "../config/db.js"
import createRequestTable from "../tables/Request.js"
import Routes from "../routes/index.js"

// Load environment variables
config()

const app = express()
const PORT = process.env.PORT || 3000

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`)
})

export default app
