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

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId }, raw: true })
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

let updateUserData = (data) => {
  // console.log(data)

  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      })
      if (user) {
        user.firstName = data.firstName
        user.lastName = data.lastName
        user.address = data.address

        await user.save()
        let allUsers = await db.User.findAll()
        resolve(allUsers)
      } else {
        resolve()
      }
    } catch (error) {
      console.log(error)
    }
  })
}

let deleteUserById = (id) => {
  // console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
      })
      if (user) {
        await user.destroy()
      }

      let allUsers = await db.User.findAll()
      resolve(allUsers)
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
}
