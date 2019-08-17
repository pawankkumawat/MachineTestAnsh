import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './session-jwt';

export function retrieveUserIdFromRequest(req: Request, res: Response, next: NextFunction) {

    const authtoken = req.headers['authtoken'];
    console.log('authtoken',authtoken);
    if (authtoken) { 
        try {
            let user = verifyToken(authtoken);
            console.log('user',user);
            req['user'] = user;
            next();
        } catch{
            console.log('exception')
            next();
        }
    } else {
        next();
    }

}