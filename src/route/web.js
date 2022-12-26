import express from "express";
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from "../controllers/doctorController"

let router = express.Router();


let initWebRouter = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/about', homeController.getAboutPage)
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayGetCRUD)

    router.get('/edit-crud', homeController.getEditCRUD)
    router.post('/put-crud', homeController.putCRUD)
    router.get('/delete-crud', homeController.deleteUser)

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-user', userController.handleGetAllUser)
    router.post('/api/creat-new-user', userController.handleCreatNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/allcode', userController.getAllcode)

    router.get('/api/top-doctor-home', doctorController.getTopDoctor)
    router.get('/api/get-all-doctors', doctorController.getAllDoctor)

    router.post('/api/save-infor-doctor', doctorController.saveInforDoctor)


    router.get('/thuycot', (req, res) => {
        return res.send('Hello Nguyễn Thị Thủy Cọt')
    })



    return app.use("/", router)
}

module.exports = initWebRouter;