import userService from '../services/userService'


let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing parameter input'
        })
    }
    let userData = await userService.handleUserLogin(email, password)


    // check email exist
    // compare password
    // return userInfo
    // access_token: JWT json web token
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleGetAllUser = async (req, res) => {
    let id = req.query.id // All SINGLE


    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing parameter',
            user: []
        })
    }
    let user = await userService.GetAllUser(id)


    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        user
    })
}
let handleCreatNewUser = async (req, res) => {
    let message = await userService.creatNewUser(req.body)

    return res.status(200).json(message)
}
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing parameter please id',
        })
    }
    let message = await userService.DeleteUser(req.body.id)

    return res.status(200).json(message)

}
let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUerData(data)
    return res.status(200).json(message)
}
let getAllcode = async (req, res) => {
    try {
        let data = await userService.getAllcodeService(req.query.type)

        return res.status(200).json(data)
    }
    catch (e) {
        return res.status(200).json({
            errcode: -1,
            errMesssage: ' Not connect rom server'
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreatNewUser: handleCreatNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllcode: getAllcode
}