import db from "../models/index"
import CRUDService from "../services/CRUDService"

let getGomePage = async (req, res) => {
  try {
    let data = await db.User.findAll()
    return res.render("homepage.ejs", { data: JSON.stringify(data) })
  } catch (error) {
    console.log(error)
  }
}

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs")
}

let getCRUD = (req, res) => {
  return res.render("crud.ejs")
}

// day data user len server va tao moi user record trong bang users
let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body)
  return res.send("post crud from server")
}

// get toan bo du lieu tu bang users cho vo dataTable hien thi = table
let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser()
  return res.render("displayCRUD.ejs", { dataTable: data })
}

// get Chinh Sua du lieu
let getEditCRUD = async (req, res) => {
  let userId = await req.query.id

  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId)
    //check user data not found

    return res.render("editCRUD.ejs", {
      userData: userData,
    })
  } else {
    return res.send("Users not found!!")
  }
}

let putCRUD = async (req, res) => {
  let data = req.body
  let allUsers = await CRUDService.updateUserData(data)
  return res.render("displayCRUD.ejs", { dataTable: allUsers })
}

let deleteCRUD = async (req, res) => {
  let id = req.query.id
  let data = await CRUDService.deleteUserById(id)

  return res.render("displayCRUD.ejs", { dataTable: data })
}

module.exports = {
  getGomePage: getGomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
}
