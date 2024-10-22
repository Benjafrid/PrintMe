import { Router } from 'express';
import {verifyToken, verifyAdmin} from "../middlewares/auth.middleware.js";
import CompradoresController from '../controllers/compradores.controller.js';
import productosControllers from '../controllers/productos.controllers.js';

const router = Router();

router.get("/compradorByID/:id", verifyToken, CompradoresController.obtenercompradoresID);
router.put("/updatecomprador/:id",verifyToken, CompradoresController.updateComprador);
router.delete("/deletecomprador/:id", verifyToken, CompradoresController.deletecomprador);

router.get("/", productosControllers.getProductos);
router.get("/producto/:id", productosControllers.getProductoById);
router.post("/create", verifyToken, verifyAdmin, productosControllers.createProducto);
router.put("/update/:id", verifyToken, verifyAdmin, productosControllers.updateProducto);
router.delete("/delete/:id", verifyToken, verifyAdmin, productosControllers.deleteProductos);

export default router;