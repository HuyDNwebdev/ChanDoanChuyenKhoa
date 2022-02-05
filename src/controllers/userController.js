import userService from "../services/userService"

let handleLogin = async (req, res) => {
  let email = req.body.email
  let password = req.body.password

  if (!email || !password) {
    return res
      .status(500)
      .json({ errCode: 1, message: "Missing inputs parameter!" })
  }

  let userData = await userService.handleUserLogin(email, password) //check email exist in db

  if (userData.errCode == 0) {
    return res.status(200).json({
      errCode: userData.errCode,
      message: userData.errMessage,
      user: userData.user ? userData.user : {}, //If don't have user or any error
    })
  } else {
    return res.status(500).json({
      errCode: userData.errCode,
      message: userData.errMessage,
      user: userData.user ? userData.user : {}, //If don't have user or any error
    })
  }
}

let handleGetAllUser = async (req, res) => {
  let id = req.query.id //ALL, id

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      users,
    })
  }
  let users = await userService.getAllUsers(id)

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  })
}

module.exports = {
  handleLogin,
  handleGetAllUser,
}
