import { StatusCodes } from 'http-status-codes';
import { Router, Request, Response, NextFunction } from "express";

const STATUS_ROUTE = Router();

STATUS_ROUTE.get('/status', (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
});

export default STATUS_ROUTE;