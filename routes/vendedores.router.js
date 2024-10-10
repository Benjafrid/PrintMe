import {Router} from 'express';
import {verifyToken} from "../middlewares/auth.middleware.js";
import VendedorController from '../controllers/vendedores.controller.js';

const router = Router();

router.get("/vendedorByID/:id", verifyToken, VendedorController.obtenervendedorID)
router.put("/updatevendedor/:id",verifyToken, VendedorController.updatevendedor)
router.delete("/deletevendedor/:id",verifyToken, VendedorController.deletevendedor)

export default router;