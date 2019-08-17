import { Response, Request } from 'express';
import { sessionStore } from './session-store';
import { db } from './database';
import { User } from './models';
import { ServerResponse } from './functionconstrotors';
export function getUser(req: Request, res: Response) {
    let user = req['user'];
    if (user && user.sub) {


        let obj = db.getUserById(user.sub);
        let userClient: User = { id: obj.id, email: obj.email, roles: obj.roles }
        let serverResponse = new ServerResponse<User>({
            ResultSet: userClient,
            ServerMsg: "Operation Successful",
            ServerMsgLangCode: 'EN',
            ServerMsgType: 'SUCCESS'
        });

        res.status(200).json(serverResponse);
    } else {
        res.sendStatus(403).json({ message: 'Unauthenticated user!' });
    }

}