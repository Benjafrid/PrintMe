import {Router} from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import productosControllers from "../controllers/productos.controllers.js";

const router = Router();

router.get("/", productosControllers.getProductos);
router.get("/producto/:id", productosControllers.getProductoById);
router.post("/create", verifyToken, verifyAdmin, productosControllers.createProducto);
router.put("/update/:id", verifyToken, verifyAdmin, productosControllers.updateProducto);
router.delete("/delete/:id", verifyToken, verifyAdmin, productosControllers.deleteProductos);

export default router;