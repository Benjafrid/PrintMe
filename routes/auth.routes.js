import {Router} from 'express';
import { verifyToken} from "../middlewares/auth.middleware.js";
import authController from '../controllers/auth.controller.js';
const router = Router();

router.get("/login", verifyToken,authController.login);
router.get("/registercomp", verifyToken, authController.registercomp);
router.get("/registervend", verifyToken,authController.registervendedor);

export default router;