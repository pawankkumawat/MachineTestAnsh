import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash'

export function checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req['user']) {
        console.log('checkIfAuthenticated', true)
        next();
    } else {
        console.log('checkIfAuthenticated', false)
        res.status(403).json({ message: 'Unauthenticated user!' });
    }
}


export function checkIfAuthorized(allowedRoles: string[], req: Request, res: Response, next: NextFunction) {
    let userInfo = req['user'];///
    //{ roles: [ 'ADMIN', 'MEMBER' ],
    //   iat: 1565580944,
    //   exp: 1565584544,
    //   sub: '1' }

    console.log('checkIfAuthorized userInfo', userInfo)
    if (userInfo && userInfo.sub) {
        if (_.intersection(userInfo.roles, allowedRoles).length > 0) {
            console.log('checkIfAuthorized', true)
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized user!' });
        }
    } else {
        res.status(403).json({ message: 'Unauthenticated user!' });
    }
}