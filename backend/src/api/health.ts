import { Request, Response, NextFunction } from 'express';

export const getHealth = (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
        "status": "ok"
    });
}
