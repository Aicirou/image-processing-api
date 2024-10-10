import { parse } from "csv-parse"

export async function processCSV(buffer) {
  return new Promise((resolve, reject) => {
    const results = []
    const parser = parse({ columns: true, trim: true })

    parser.on("data", (data) => {
      results.push({
        serialNumber: data["S. No."],
        productName: data["Product Name"],
        inputImageUrls: data["Input Image Urls"]
          .split(",")
          .map((url) => url.trim()),
      })
    })

    parser.on("end", () => resolve(results))
    parser.on("error", (error) => reject(error))

    // Process CSV from buffer
    parser.write(buffer)
    parser.end()
  })
}
