import db from "../models/index"

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
module.exports = { getGomePage: getGomePage, getAboutPage: getAboutPage }
