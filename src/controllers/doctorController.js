
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

module.exports = {
    getTopDoctor: getTopDoctor
}