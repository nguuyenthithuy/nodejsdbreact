import { resolve } from 'path'
import db from '../models/index'


let gettopDoctorHome = (inputLimit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: inputLimit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: [
                        'password'
                    ]
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true

            })
            resolve({
                errCode: 0,
                data: users
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: [
                        'password', 'image'
                    ]
                },

            })
            resolve({
                errCode: 0,
                data: doctors
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }
            else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })
                resolve({
                    errCode: 0,
                    Message: 'Save markdown success'
                })
            }

        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    gettopDoctorHome: gettopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveDetailInforDoctor: saveDetailInforDoctor
}