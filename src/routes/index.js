import { Router } from "express"
// Import your API route handlers
import rootRoutes from "./root.js"
import uploadRoutes from "./upload.js"
import statusRoutes from "./status.js"

const router = Router()

// Mount the API routes
router.use("/", rootRoutes)
router.use("/api", uploadRoutes)
router.use("/api", statusRoutes)

export default router
