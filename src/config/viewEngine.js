import express from "express"

let configViewEngine = (app) => {
  //arrow function
  app.use(express.static("./src/public")) //cho pheps client biet truy cap vao public de lay anh
  app.set("view engine", "ejs") //tuong duong jsp cua java, blade cua php
  app.set("views", "./src/views") //set duong link lay view engine lay cac file ejs trong views
}

module.exports = configViewEngine
