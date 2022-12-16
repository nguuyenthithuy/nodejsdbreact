import db from "../models/index"
import CRUDService from "../services/CRUDService"

let getHomePage = async (req, res) => {


    try {
        let data = await db.User.findAll();
        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        })
    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs')
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}
let postCRUD = async (req, res) => {
    let message = await CRUDService.creatNewUser(req.body);
    console.log(message);
    return res.send('Hello post CRUD')
}
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    console.log('-----------------------')
    console.log(data)
    console.log('-----------------------')
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;

    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId)


        return res.render('editCRUD.ejs', {
            user: userData,
        })
    }
    else {
        return res.send('NO hello Edit CRUD')
    }


}
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUerData(data)
    return res.render('displayCRUD.ejs', {
        dataTable: allUser
    })
}
let deleteUser = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUser(id)
        return res.send('delete succes')
    }
    else {
        return res.send('Not delete found')
    }


}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteUser: deleteUser,
}