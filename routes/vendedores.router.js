import {Router} from 'express';
import {verifyToken, verifyAdmin} from "../middlewares/auth.middleware.js";
import VendedorController from '../controllers/vendedores.controller.js';
import pedidosControllers from '../controllers/pedidos.controllers.js';

const router = Router();

router.get("/vendedorByID/:id", verifyToken, VendedorController.obtenervendedorID)
router.put("/updatevendedor/:id",verifyToken, VendedorController.updatevendedor)
router.delete("/deletevendedor/:id",verifyToken, VendedorController.deletevendedor)

router.get("/pedidos", pedidosControllers.getPedidos);
router.get("/usuarioid", pedidosControllers.getPedidosByUser);
router.get("/pedidosID/:id", pedidosControllers.getPedidoById);
router.post("/createpedido", verifyAdmin, pedidosControllers.createPedido);
router.put("/comenzar/:id", pedidosControllers.comenzarPedido);
router.put("/entregar/:id",  pedidosControllers.entregarPedido);
router.delete("/delete/:id", pedidosControllers.deletePedido);

export default router;