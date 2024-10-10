import sharp from "sharp"
import axios from "axios"
import pool from "../config/db.js"

export async function processImages(requestId) {
  try {
    const requestResult = await pool.query(
      `
        SELECT * FROM "Requests"
        WHERE "requestId" = $1
        FOR UPDATE
      `,
      [requestId]
    )
    const request = requestResult.rows[0]
    console.log("Request found:", request)

    if (!request) {
      throw new Error("Request not found")
    }

    console.log("request:", request)

    // Update request status to "processing"
    await pool.query(
      `
        UPDATE "Requests"
        SET "status" = 'processing'
        WHERE "requestId" = $1
      `,
      [requestId]
    )

    const outputData = []

    for (const item of request.csvData) {
      const outputImageUrls = []

      // Process each input image URL
      for (const inputUrl of item.inputImageUrls) {
        const outputUrl = await processImage(inputUrl)
        outputImageUrls.push(outputUrl)
      }

      // Push the processed output along with other data from item
      outputData.push({
        ...item,
        outputImageUrls,
      })
    }

    // Now you have a properly formatted outputData array
    console.log("Processed output data:", outputData)

    // Update request status to "completed" and store the outputData (as JSON)
    await pool.query(
      `
        UPDATE "Requests"
        SET "status" = 'completed', "outputData" = $2
        WHERE "requestId" = $1
      `,
      [requestId, JSON.stringify(outputData)]
    )

    // Trigger webhook
    await triggerWebhook(requestId)
  } catch (error) {
    console.error(`Error processing images for request ${requestId}:`, error)
    await pool.query(
      `
        UPDATE "Requests"
        SET "status" = 'failed'
        WHERE "requestId" = $1
      `,
      [requestId]
    )
  }
}

async function processImage(inputUrl) {
  const response = await axios.get(inputUrl, { responseType: "arraybuffer" })
  console.log("Processing image:", inputUrl)
  console.log("Image size:", response.data.length / 1024, "KB")
  // Format it with the proper MIME type for use in <img src>
  const mimeType = response.headers["content-type"]

  // Convert binary data to a buffer
  const buffer = Buffer.from(response.data, "binary")
  // const processedBuffer = await sharp(buffer).jpeg({ quality: 50 }).toBuffer()
  // In a real-world scenario, you would upload the processed image to a storage service
  // and return the URL. For this example, we'll just return a placeholder URL.
  const base64Image = buffer.toString("base64")

  return `data:${mimeType};base64,${base64Image}`
}

async function triggerWebhook(requestId) {
  const webhookUrl = process.env.WEBHOOK_URL
  if (webhookUrl) {
    try {
      await axios.post(webhookUrl, { requestId, status: "completed" })
    } catch (error) {
      console.error(`Error triggering webhook for request ${requestId}:`, error)
    }
  }
}
