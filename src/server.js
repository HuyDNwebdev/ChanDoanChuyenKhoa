import express from "express"

import bodyParser from "body-parser"
import viewEngine from "./config/viewEngine"
import initWebRouters from "./route/web"
import connectDB from "./config/connectDB"
require("dotenv").config()

let app = express()

//config app

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

viewEngine(app)
initWebRouters(app)

connectDB()

//Port === undefined => port =8069

const port = process.env.PORT || 8069

app.listen(port, () => {
  console.log("Backend Nodejs is running on the port: " + port)
})
