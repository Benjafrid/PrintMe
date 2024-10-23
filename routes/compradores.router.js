import { Router } from 'express';
import {verifyToken, verifyAdmin} from "../middlewares/auth.middleware.js";
import CompradoresController from '../controllers/compradores.controller.js';
import productosControllers from '../controllers/productos.controllers.js';

const router = Router();

router.get("/compradorByID/:id", verifyToken, CompradoresController.obtenercompradoresID);
router.put("/updatecomprador/:id",verifyToken, CompradoresController.updateComprador);
router.delete("/deletecomprador/:id", verifyToken, CompradoresController.deletecomprador);

router.get("/", productosControllers.getProductos);
router.get("/productoid/:id", productosControllers.getProductoById);
router.post("/create", verifyToken, productosControllers.createProducto);
router.put("/update/:id", verifyToken, productosControllers.updateProducto);
router.delete("/delete/:id", verifyToken, productosControllers.deleteProductos);

export default router;