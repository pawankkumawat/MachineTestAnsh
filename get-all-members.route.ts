
import { Response, Request } from 'express';
import { db } from './database';
import { sessionStore } from './session-store';
export function getAllMembers(req: Request, res: Response) {

    // const sessionId = req.cookies['SESSIONID'];
    // const isValidSession = sessionStore.isSessionValid(sessionId);
    // if (isValidSession) {
    //     res.status(200).json({ members: db.getAllMembers() });
    // } else {
    //     res.status(200).json();
    // }

    if (req.headers['authtoken']) {
                res.status(200).json({ members: db.getAllMembers() });
    } else {
        console.log('getAllMembers else' );        
        res.status(200).json();
    }
}