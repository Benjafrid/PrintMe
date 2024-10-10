import { Router } from 'express';
import {verifyToken} from "../middlewares/auth.middleware.js";
import CompradoresController from '../controllers/compradores.controller.js';

const router = Router();

router.get("/compradorByID/:id", verifyToken, CompradoresController.obtenercompradoresID);
router.put("/updatecomprador/:id",verifyToken, CompradoresController.updateComprador);
router.delete("/deletecomprador/:id", verifyToken, CompradoresController.deletecomprador);

export default router;