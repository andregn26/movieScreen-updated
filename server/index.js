import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import mongoose from "mongoose"
import morgan from "morgan"

import authRoutes from "./routes/auth.js"

//!CONFIGURATIONS
dotenv.config()
const app = express()
app.use(cors())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//!ROUTES
app.use("/auth", authRoutes)
app.use((req, res, next) => {
  // this middleware runs whenever requested page is not available
  res.status(404).json({ errorMessage: "This route does not exist" })
})

app.use((err, req, res, next) => {
  // whenever you call next(err), this middleware will handle the error
  // always logs the error
  console.error("ERROR", req.method, req.path, err)

  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      message: "woooops your token expired",
    })
  }
  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500).json({
      errorMessage: "Internal server error. Check the server console",
    })
  }
})

//!MONGOOSE
const PORT = process.env.PORT || 9000
mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .finally((x) => {
    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))
  })
  .catch((error) =>
    console.error(
      `Did not connect !!!! error name --> ${error.name} && error message -->${error.message} `
    )
  )
