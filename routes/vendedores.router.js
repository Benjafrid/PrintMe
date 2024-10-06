import {Router} from 'express';
import VendedorController from '../controllers/vendedores.controller.js';

const router = Router();

router.get("/vendedorByID",VendedorController.obtenervendedorID)
router.put("/updatevendedor",VendedorController.updatevendedor)
router.delete("/deletevendedor",VendedorController.deletevendedor)

export default router;