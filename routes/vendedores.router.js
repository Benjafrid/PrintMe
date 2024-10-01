import {Router} from 'express';
import VendedoresController from '../controllers/vendedores.controller.js';

const router = Router();

router.get("/VendedorEmail/:email", VendedoresController.getVendedoresByEmail)
router.get("/vendedorByID")
router.post("/createvendedor")
router.put("/updatevendedor")
router.delete("/deletevendedor")

export default router;