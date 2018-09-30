import {Router} from 'express';
import {WaterBodyController} from '../controllers/water_body.controller';

const router: Router = Router();

router.get('/waterbodies/:id', WaterBodyController.getWaterBodyJSON);

export const ApiRouter = router;