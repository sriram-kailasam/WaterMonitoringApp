import {Router} from 'express';
import {IndexController} from '../controllers/index.controller';

const router: Router = Router();

router.get('/', IndexController.greet);

export const IndexRouter: Router = router;