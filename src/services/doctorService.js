
import db from '../models/index'
import _, { reject } from 'lodash'
require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

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
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown
                || !inputData.action
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }
            else {
                if (inputData && inputData.action === 'CREAT') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                }
                if (inputData && inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML,
                            doctorMarkdown.contentMarkdown = inputData.contentMarkdown,
                            doctorMarkdown.description = inputData.description,
                            await doctorMarkdown.save();
                    }
                }

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

let getDetailDoctorById = (inpuId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inpuId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: inpuId },

                    attributes: {
                        exclude: [
                            'password',
                        ]
                    },
                    include: [
                        { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown', 'description'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true

                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')

                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }
            else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                // get existing data
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['doctorId', 'date', 'timeType', 'maxNumber'],
                    raw: true
                })


                // convert date
                if (existing && existing.length > 0) {
                    existing = existing.map(item => {
                        item.date = new Date(item.date).getTime();
                        return item
                    })
                }
                // compare different so sánh xem 2 mảng có khác nhau không
                let toCreate = _.differenceWith(schedule, existing, (a, b) => { // lodash so sánh 
                    return a.timeType === b.timeType && a.date === b.date // sự khác nhau khác c++ nha (do hàm different)

                    // có nghĩa là nó return về cái khác nhau chứ k phải cái giống nhau
                });
                // ok thì lưu xuống db

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate) // thêm nhiều dữ liệu 1 lúc
                }
                console.log('check existing', existing)

                console.log('check toCreat ', toCreate)

                resolve({
                    errCode: 0,
                    errMessage: "OK"
                })
            }




        }
        catch (e) {
            reject(e)
        }
    })
}
let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date }
                })

                if (!dataSchedule) dataSchedule = []

                resolve({
                    errCode: 0,
                    data: dataSchedule
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
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate
}