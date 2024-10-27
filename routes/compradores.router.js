import { Router } from 'express';
import {verifyToken, verifyAdmin} from "../middlewares/auth.middleware.js";
import CompradoresController from '../controllers/compradores.controller.js';
import productosControllers from '../controllers/productos.controllers.js';
import upload from "../upload.js"


const router = Router();


//COMPRADORES
router.get("/compradorByID/:id", verifyToken, CompradoresController.obtenercompradoresID);
router.put("/updatecomprador/:id",verifyToken, CompradoresController.updateComprador);
router.delete("/deletecomprador/:id", verifyToken, CompradoresController.deletecomprador);

//PRODUCTOS
router.get("/", productosControllers.getProductos);
router.get("/productoid/:id", productosControllers.getProductoById);
router.post("/create", verifyToken, productosControllers.createProducto);
router.put("/update/:id", verifyToken, verifyAdmin, productosControllers.updateProducto);
router.delete("/delete/:id", verifyToken, verifyAdmin, productosControllers.deleteProductos);


export default router;