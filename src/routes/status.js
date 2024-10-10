import { Router } from "express"
import pool from "../config/db.js"
import path from "path"

const router = Router()

router.get("/status/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params
    const result = await pool.query(
      `
        SELECT "status" FROM "Requests"
        WHERE "requestId" = $1
      `,
      [requestId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" })
    }

    res.status(200).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/status/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/public/status.html"))
})

router.get("/displayImages/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params

    const result = await pool.query(
      `
    SELECT * FROM "Requests"
    WHERE "requestId" = $1
  `,
      [requestId]
    )

    const outputRow = result.rows[0]
    console.log(outputRow)

    const outputImageUrls = Array.isArray(outputRow.outputData)
      ? outputRow.outputData.flatMap((data) => data.outputImageUrls)
      : []

    const htmlContent = `
     <h1>Output Images (<i style='font-size: 0.8em;'>compressed by 50%</i>):</h1>
    <ol>
            ${outputImageUrls
              .map(
                (url) => `
                <oi>
                <img src="${url}" />
                </oi>`
              )
              .join("")}
    </ol>
`
    return res.status(200).json({ htmlContent: htmlContent })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
