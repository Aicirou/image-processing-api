import express from "express"
import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import { processCSV } from "../services/csvProcessor.js"
import { processImages } from "../services/imageProcessor.js"
import pool from "../config/db.js"
import path from "path"
import fs from "fs"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post("/upload", upload.single("csv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded" })
    }

    const requestId = uuidv4()
    const csvData = await processCSV(req.file.buffer)

    //insert request into database
    try {
      const result = await pool.query(
        `
        INSERT INTO "Requests" ("requestId", "csvData")
        VALUES ($1, $2)
    `,
        [requestId, JSON.stringify(csvData)]
      )
      console.log("Request inserted into database:", result)
    } catch (error) {
      console.error("Error inserting request into database:", error)
      return res.status(500).json({ error: "Internal server error" })
    }

    // Start asynchronous processing
    processImages(requestId)

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Request Submitted</title>
      <style>
        body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: top;
        height: auto;
        }
        .container {
        margin-top: 50px;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        text-align: center;
        }
        h1 {
        color: #333;
        }
        p {
        color: #666;
        }
        a {
        color: #007BFF;
        text-decoration: none;
        }
        a:hover {
        text-decoration: underline;
        }
      </style>
      </head>
      <body>
      <div class="container">
        <h1>Request Submitted</h1>
        <p>Your request ID is: <strong>${requestId}</strong></p>
        <p>Please wait while we process your request.</p>
        <p>To know the status of your request, paste the ID at <a href="/api/status/">/api/status</a></p>
      </div>
      </body>
      </html>
    `)
  } catch (error) {
    console.error("Error in /upload route:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/upload", (req, res) => {
  // res.json({ message: "This is the upload route" })
  res.sendFile(path.join(process.cwd(), "src/public/upload.html"))
})

export default router
