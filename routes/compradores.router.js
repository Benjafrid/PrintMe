import {Router} from 'express';
import CompradoresController from '../controllers/compradores.controller.js';

const router = Router();

router.get("/compradorByID/:id", CompradoresController.obtenercompradoresID);
router.put("/updatecomprador/:id",CompradoresController.updateComprador);
router.delete("/deletecomprador/:id",CompradoresController.deletecomprador);

export default router;