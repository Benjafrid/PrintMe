import {Router} from 'express';
import {verifyToken} from "../middlewares/auth.middleware.js";
import authController from '../controllers/auth.controller.js';
const router = Router();

router.post("/login", verifyToken, authController.login);
router.post("/registercomp", verifyToken, authController.registercomp);
router.post("/registervend", verifyToken ,authController.registervendedor);

export default router;