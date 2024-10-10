import { Router } from "express"
import path from "path"

const router = Router()

router.get("/", (req, res) => {
  res.send(`
            <style>
                    body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 20px;
                            text-align: center;
                    }
                    h1 {
                            color: #333;
                    }
                    h2 {
                            color: #666;
                    }
                    a {
                            color: #007bff;
                            text-decoration: none;
                    }
                    a:hover {
                            text-decoration: underline;
                    }
            </style>
            <h1>Welcome to image processing api!</h1>
            <h2>To access the APIs, please go to <a href="/api">/api</a></h2>
    `)
})

router.get("/api", (req, res) => {
  //current working directory
  const cwd = process.cwd()
  console.log(cwd)
  res.sendFile(path.join(cwd, "src/public/index.html"))
})

export default router
