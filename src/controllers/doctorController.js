
import doctorService from "../services/doctorService"

let getTopDoctor = async (req, res) => {
    let limit = req.query.limit //giới hạn limit
    if (!limit) limit = 10

    try {
        let response = await doctorService.gettopDoctorHome(+limit) // chuyển string thành số nguyên

        return res.status(200).json(response)

    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'wrong from sever ...'
        })
    }
}
let getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctor()
        return res.status(200).json(doctors)
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let saveInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    getTopDoctor: getTopDoctor,
    getAllDoctor: getAllDoctor,
    saveInforDoctor: saveInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule
}