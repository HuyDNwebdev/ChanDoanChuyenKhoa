import bcrypt from "bcryptjs"
import db from "../models/index"

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

      resolve("created a new user succefully")
    } catch (error) {
      reject(error)
    }
  })
}

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({ raw: true })
      resolve(users)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = { createNewUser: createNewUser, getAllUser: getAllUser }
