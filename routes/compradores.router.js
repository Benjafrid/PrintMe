import {Router} from 'express';
import CompradoresController from '../controllers/compradores.controller.js';

const router = Router();

router.get("/compradorByID", CompradoresController.obtenercompradoresID);
router.put("/updatecomprador",CompradoresController.updateComprador);
router.delete("/deletecomprador",CompradoresController.deletecomprador);

export default router;