import {Router, Request, Response} from 'express';
import {WaterBodyController} from '../controllers/water_body.controller';

const router: Router = Router();

router.get('/', WaterBodyController.listAllWaterBodies);
router.get('/:id', WaterBodyController.showWaterBody);

export const WaterBodyRouter = router;