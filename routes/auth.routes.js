import {Router} from 'express';
import authController from '../controllers/auth.controller.js';
const router = Router();

router.post("/login", authController.login);
router.post("/registercomp", authController.registercomp);
router.post("/registervend", authController.registervendedor);

export default router;