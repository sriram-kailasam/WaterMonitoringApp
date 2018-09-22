import {Router, Request, Response} from 'express';
import {WaterBodyController} from '../controllers/water_body.controller';

const router: Router = Router();

router.get('/', WaterBodyController.listAllWaterBodies);
router.get('/:id', WaterBodyController.showWaterBody);
router.get('/:id/temperature', WaterBodyController.showWaterBodyTemperature);
router.get('/:id/humidity', WaterBodyController.showWaterBodyHumidity);

export const WaterBodyRouter = router;