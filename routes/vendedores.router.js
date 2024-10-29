import {Router} from 'express';
import {verifyToken, verifyAdmin} from "../middlewares/auth.middleware.js";
import VendedorController from '../controllers/vendedores.controller.js';
import pedidosControllers from '../controllers/pedidos.controllers.js';

const router = Router();

router.get("/buscar", VendedorController.buscarVendedor);
router.get("/vendedorByID/:id", verifyToken, VendedorController.obtenervendedorID)
router.put("/updatevendedor/:id",verifyToken, VendedorController.updatevendedor)
router.delete("/deletevendedor/:id",verifyToken, VendedorController.deletevendedor)

router.get("/pedidos", pedidosControllers.getPedidos);
router.get("/:id", pedidosControllers.getPedidosByUser);
router.get("/pedidosID/:id", pedidosControllers.getPedidoById);
router.post("/createpedido",verifyToken, pedidosControllers.createPedido);
router.put("/comenzar/:id", verifyToken, verifyAdmin, pedidosControllers.comenzarPedido);
router.put("/entregar/:id",  verifyToken, verifyAdmin, pedidosControllers.entregarPedido);
router.delete("/delete/:id", verifyToken, verifyAdmin, pedidosControllers.deletePedido);



export default router;