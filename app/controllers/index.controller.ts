import {Request, Response} from 'express';

export class IndexController {
	static greet(req: Request, res: Response) {
		res.render('index');
	}
}