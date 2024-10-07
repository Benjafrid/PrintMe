import {Router} from 'express';
import VendedorController from '../controllers/vendedores.controller.js';

const router = Router();

router.get("/vendedorByID/:id",VendedorController.obtenervendedorID)
router.put("/updatevendedor/:id",VendedorController.updatevendedor)
router.delete("/deletevendedor/:id",VendedorController.deletevendedor)

export default router;