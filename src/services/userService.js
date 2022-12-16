
import db from '../models/index'
import bcrypt from 'bcryptjs';


const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}


let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkEmailUser(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);


                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = `Wrong password`;
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = `user not found`;

                }

            }
            else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist in your system. Please try other email`

            }
            resolve(userData)
        }
        catch (e) {
            reject(e)
        }
    })

}

let checkEmailUser = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let GetAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: [
                            'password'
                        ]
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    attributes: {
                        exclude: [
                            'password'
                        ]
                    },
                    where: { id: userId }
                })
            }
            resolve(users)
        }
        catch (e) {
            reject(e)
        }
    })
}
let creatNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkEmailUser(data.email)
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMassage: 'Your email is already in used ,Please try another email'
                })
            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                })
                resolve({
                    errCode: 0,
                    massage: 'Ok'
                })
            }




        }
        catch (e) {
            reject(e)
        }
    })
}
let DeleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: 'The user isnt exist'
            })
        }
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            message: 'The user is deleted'
        })
    })
}
let updateUerData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Please id'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false  // fix th user.save is not funcion
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save()

                resolve({
                    errCode: 0,
                    message: 'Update user success'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    message: 'Find not found user'
                });
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllcodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: ' Missing requier parameters'

                })
            }
            else {
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });

                res.errCode = 0;
                res.data = allcode
                resolve(res)
            }

        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    GetAllUser: GetAllUser,
    creatNewUser: creatNewUser,
    DeleteUser: DeleteUser,
    updateUerData: updateUerData,
    getAllcodeService: getAllcodeService
}