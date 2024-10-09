import {Router} from 'express';
import { verifyToken} from "../middlewares/auth.middleware.js";
import authController from '../controllers/auth.controller.js';
const router = Router();

router.put("/login", verifyToken,authController.login);
router.put("/registercomp", verifyToken, authController.registercomp);
router.put("/registervend", verifyToken,authController.registervendedor);

export default router;