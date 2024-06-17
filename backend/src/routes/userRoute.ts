import express from "express";
import * as userController from "../controller/user.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.get("/getUser",  authenticate, userController.getUser);
router.post("/addUser", authenticate, userController.addUser);
router.post("/editUser", authenticate, userController.editUser);
router.post("/deleteUser",  authenticate, userController.deleteUser);
router.post("/updateStatus",  authenticate, userController.updateStatus);
router.post("/updateRole",  authenticate, userController.updateRole);

export default router