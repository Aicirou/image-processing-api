import pool from "../config/db.js"

try {
  //drop table
  await pool.query(
    `
                DROP TABLE IF EXISTS "Requests"
            `
  )
} catch (error) {
  console.error("Error dropping table", error)
}
