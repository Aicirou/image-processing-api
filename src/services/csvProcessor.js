import fs from "fs"
import { parse } from "csv-parse"

export async function processCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (data) => {
        results.push({
          serialNumber: data["S. No."],
          productName: data["Product Name"],
          inputImageUrls: data["Input Image Urls"]
            .split(",")
            .map((url) => url.trim()),
        })
      })
      .on("end", () => {
        //remove the file from the uploads folder
        fs.unlink(filePath, (error) => {
          if (error) {
            console.error("Error deleting CSV file:", error)
          }
        })

        //resolve the promise with the results
        resolve(results)
      })
      .on("error", (error) => {
        console.error("Error processing CSV:", error)
        reject(error)
      })
  })
}
