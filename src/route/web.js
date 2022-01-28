import express from "express"
import homeController from "../controllers/homeController"

let router = express.Router()

let initWebRouters = (app) => {
  router.get("/", homeController.getGomePage)
  router.get("/about", homeController.getAboutPage)
  router.get("/crud", homeController.getCRUD)

  router.get("/get-crud", homeController.displayGetCRUD)
  router.post("/post-crud", homeController.postCRUD)
  router.get("/edit-crud", homeController.getEditCRUD)
  router.post("/put-crud", homeController.putCRUD)
  router.get("/delete-crud", homeController.deleteCRUD)
  return app.use("/", router)
}

module.exports = initWebRouters
