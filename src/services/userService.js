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

const salt = bcrypt.genSaltSync(10)
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt)
      resolve(hashPassword)
    } catch (error) {
      reject(error)
    }
  })
}

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email is exist ???
      let check = await checkUserEmail(data.email)
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Your email is already in use, Plz try another email!",
        })
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password)
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          gender: data.gender === "1" ? true : false,
          phoneNumber: data.phoneNumber,
          roleId: data.roleId,
        })

        resolve({
          errCode: 0,
          errMessage: "OK",
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId }, raw: false })
      if (user) {
        resolve(user)
      } else {
        resolve({})
      }
    } catch (error) {
      reject(error)
    }
  })
}

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await getUserInfoById(userId)
      if (!user) {
        return resolve({
          errCode: 2,
          errMessage: "The user is not exist",
        })
      }
      await user.destroy()
      resolve({ errCode: 0, message: "User deleted." })
    } catch (error) {
      reject(error)
    }
  })
}

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        })
      }
      let user = await getUserInfoById(data.id)
      if (user) {
        user.firstName = data.firstName
        user.lastName = data.lastName
        user.address = data.address
        user.email = data.email

        await user.save()

        return resolve({
          errCode: 0,
          errMessage: "Update the user succeeds",
        })
      } else {
        resolve({
          errCode: 1,
          errMessage: "User's not found",
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  handleUserLogin,
  checkUserEmail,
  getAllUsers,
  createNewUser,
  getUserInfoById,
  deleteUser,
  updateUserData,
}
