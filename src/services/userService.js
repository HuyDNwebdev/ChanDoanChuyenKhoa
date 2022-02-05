import { response } from "express"
import bcrypt from "bcryptjs"
import db from "../models/index"

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {}
      let isExist = await checkUserEmail(email)
      if (isExist) {
        // //User already exist
        let user = await db.User.findOne({
          where: { email: email },
          // attributes: ["email", "roleId", "password"],
          raw: true, //lay y nguyen object trong db
        })
        if (user) {
          //   //compare password
          let check = bcrypt.compareSync(password, user.password)
          if (check) {
            userData.errCode = 0
            userData.errMessage = "Ok"
            delete user.password //xoa truong password trong user
            userData.user = user
          } else {
            // check == false
            userData.errCode = 3
            userData.errMessage = "Wrong Password"
          }
        } else {
          userData.errCode = 2
          userData.errMessage = "User is not found"
        }
      } else {
        //return error
        userData.errCode = 1
        userData.errMessage = `Your's Email isn't exist in our system. Try again`
      }

      resolve(userData)
    } catch (error) {
      reject(error)
    }
  })
}

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { email: userEmail } })
      if (user) resolve(true)
      else resolve(false)
    } catch (error) {
      reject(error)
    }
  })
}

let getAllUsers = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = ""
      if (userId === "ALL") {
        data = await db.User.findAll({
          attributes: { exclude: ["password"] },
        })
      }
      if (userId && userId !== "ALL") {
        data = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ["password"] },
        })
      }
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  handleUserLogin,
  checkUserEmail,
  getAllUsers,
}
