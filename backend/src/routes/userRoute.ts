import express from "express";
import * as userController from "../controller/user.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.get("/getUser",  authenticate, userController.getUser);
router.post("/addUser", userController.addUser);
router.post("/editUser", userController.editUser);
router.post("/deleteUser",  userController.deleteUser);

export default router