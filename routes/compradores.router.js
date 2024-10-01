import {Router} from 'express';
import CompradoresController from '../controllers/compradores.controller.js';

const router = Router();

router.get("/CompradorEmail/:email", CompradoresController.getCompradorByEmail)
router.get("/compradorByID")
router.post("/createcomprador")
router.put("/updatecomprador")
router.delete("/deletecomprador")

export default router;