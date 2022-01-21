import { Request, Response, NextFunction } from "express";

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err.name === 'UnauthorizedError') {
        res.status(403).send('Invalid token');
        return next();
    }
}