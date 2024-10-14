import {Router} from 'express';
import {verifyToken, verifyAdmin} from "../middlewares/auth.middleware.js";
import VendedorController from '../controllers/vendedores.controller.js';
import pedidosControllers from '../controllers/pedidos.controllers.js';

const router = Router();

router.get("/vendedorByID/:id", verifyToken, VendedorController.obtenervendedorID)
router.put("/updatevendedor/:id",verifyToken, VendedorController.updatevendedor)
router.delete("/deletevendedor/:id",verifyToken, VendedorController.deletevendedor)

router.post("/registerUsers", upload.single('foto'), pedidosControllers.w);

router.get("/pedidos", verifyToken, verifyAdmin, pedidosControllers.getPedidos);
router.get("/usuario", verifyToken, pedidosControllers.getPedidosByUser);
router.get("/:id", verifyToken, verifyAdmin, pedidosControllers.getPedidoById);
router.post("/", verifyToken, pedidosControllers.createPedido);
router.put("/:id/comenzar", verifyToken, verifyAdmin, pedidosControllers.comenzarPedido);
router.put("/:id/entregar", verifyToken, verifyAdmin, pedidosControllers.entregarPedido);
router.delete("/:id", verifyToken, verifyAdmin, pedidosControllers.deletePedido);

export default router;