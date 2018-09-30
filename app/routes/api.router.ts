import {Router} from 'express';
import {WaterBodyController} from '../controllers/water_body.controller';

const router: Router = Router();

router.get('/waterbodies/:id', WaterBodyController.getWaterBodyJSON);
router.get('/waterbodies/:id/temperature', WaterBodyController.getWaterBodyJSON);
router.get('/waterbodies/:id/humidity', WaterBodyController.getWaterBodyHumidityJSON);

export const ApiRouter = router;