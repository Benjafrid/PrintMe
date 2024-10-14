import {Router} from 'express';
import {verifyToken} from "../middlewares/auth.middleware.js";
import VendedorController from '../controllers/vendedores.controller.js';
import pedidosControllers from '../controllers/pedidos.controllers.js';

const router = Router();

router.get("/vendedorByID/:id", verifyToken, VendedorController.obtenervendedorID)
router.put("/updatevendedor/:id",verifyToken, VendedorController.updatevendedor)
router.delete("/deletevendedor/:id",verifyToken, VendedorController.deletevendedor)
router.post("/registerUsers", upload.single('foto'), pedidosControllers.w);


export default router;