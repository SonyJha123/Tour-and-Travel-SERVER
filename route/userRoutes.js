import express from "express"
import { createUser, deleteUser, findAllUsers, forgotPassword, login, otpverify, resetpassword } from "../controller/userController.js";
const router=express.Router();
router.post("/",createUser)
router.post("/login",login)
router.post("/forgotPassword",forgotPassword)
router.post("/otpverify",otpverify)
router.post("/resetpassword",resetpassword)
router.get("/findUserById/:id")
router.get("/findAllUsers",findAllUsers)
router.get("/deleteUser/:id",deleteUser)

export default router;