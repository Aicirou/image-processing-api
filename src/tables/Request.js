const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "Requests" (
        "requestId" VARCHAR(255) PRIMARY KEY,
        "status" VARCHAR(255) CHECK("status" IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
        "csvData" JSONB,
        "outputData" JSONB,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`

const createRequestTable = async (pool) => {
  try {
    await pool.query(createTableQuery)
  } catch (error) {
    console.error(error)
  }
}

export default createRequestTable
