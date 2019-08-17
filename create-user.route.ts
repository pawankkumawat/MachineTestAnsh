import { Response, Request } from 'express';
import { db } from './database';
import { USERS, DbUser } from './database-data';
import * as  argon2 from 'argon2';
import { passwordpolicy } from './password-policy';
import { randomByte } from './session';
import { sessionStore } from './session-store';
import { createToken } from './session-jwt';
import * as _ from 'lodash';
import { Messages } from './constants';
import { ServerResponse } from './functionconstrotors';
import { User } from './models';
  

export function createUser(req: Request, res: Response) {
    // const credentials = req.body;
    // let errors = passwordpolicy(credentials.password);
    // if (errors.length > 0) {
    //     res.status(500).json(errors)
    // } else {
    //     createUsreHash(res, credentials); 
    // }


    const credentials = req.body;
    let errors = passwordpolicy(credentials.password);
    if (errors.length > 0) {
        res.status(500).json(errors)
    } else {
        createUsreHashAndSessionToken(res, credentials);
    }


}


export async function CreateDbUsers() {

    let hash = await argon2.hash('password');
    let user: DbUser = db.createUser('pawank.kumawat@gmail.com', hash);

    // setRole(user);
    hash = await argon2.hash('password');
    user = db.createUser('mom@gmail.com', hash);
    // setRole(user);
    hash = await argon2.hash('password');
    user = db.createUser('bhai@gmail.com', hash);
    // setRole(user);
    hash = await argon2.hash('password');
    user = db.createUser('vasu@gmail.com', hash);
    // setRole(user);
    // console.log(USERS);
}


export async function waitTIllAllUserCreation() {
    await CreateDbUsers();
    AddRolesToUser();
}


// function setRole(user: DbUser) {
//     if (user.email == 'pawank.kumawat@gmail.com') {
//         user.roles.push('ADMIN');
//         user.roles.push('MEMBER');
//     } else {
//         user.roles.push('MEMBER')
//     }
// }

export function AddRolesToUser() {
    console.log('USERS');
    let usersAr = _.values(USERS) as DbUser[];

    for (let user of usersAr) {
        if (user.email == 'pawank.kumawat@gmail.com') {
            user.roles.push('ADMIN');
            user.roles.push('MEMBER');
        } else {
            user.roles.push('MEMBER')
        }
    }

    // for (let user of usersAr) {
    console.log(USERS);
    // }

}


export function logOut(req: Request, res: Response) {
    // let sessionId = req.cookies['SESSIONID'];
    // sessionStore.deleteSession(sessionId);
    // res.clearCookie('SESSIONID');
    // res.status(200).json({ message: 'Logout Successful' });
    // let sessionId = req.cookies['SESSIONID'];
    // console.log('logout', sessionId);
    // res.clearCookie('SESSIONID');
    res.status(200).json({ message: 'Logout Successful' });
}


export function login(req: Request, res: Response) {
    const credentials = req.body;
    const user: DbUser = db.getUserByEmail(credentials.email);
    if (user) {
        checkCredential(credentials.password, user, res)
    } else {
        res.status(403).send(Messages.InvalidUserNamePassword);
    }

}

async function checkCredential(password, user: DbUser, res) {
    // const isVerified = await argon2.verify(user.password, password);
    // if (isVerified) {
    //     const sessionId = await randomByte(32).then(bytes => bytes.toString('hex'));
    //     sessionStore.createSession(sessionId, user);
    //     res.cookie('SESSIONID', sessionId, { httpOnly: true, secure: true });
    //     res.status(200).json({ id: user.id, email: user.email })
    // } else {
    //     res.sendStatus(403);

    // }

    const isVerified = await argon2.verify(user.password, password);
    if (isVerified) {
        let authtoken = createToken(user);
        let userClient: User = { id: user.id, email: user.email, roles: user.roles }
        let serverResponse = new ServerResponse<{ userClient: User, authtoken: any }>({
               ResultSet: { userClient, authtoken },
               ServerMsg:"Operation Successful",
               ServerMsgLangCode:'EN',
               ServerMsgType:'SUCCESS'
            });
        res.status(200).json(serverResponse);
    } else {
        res.status(403).send(Messages.InvalidUserNamePassword);

    }
}

// async function createUsreHash(res: Response, credentials: any) {
//     const hash = await argon2.hash(credentials.password);
//     console.log(hash);
//     const user: DbUser = db.createUser(credentials.email, hash);
//     const sessionId = await randomByte(32).then(bytes => bytes.toString('hex'));
//     sessionStore.createSession(sessionId, user);
//     res.cookie('SESSIONID', sessionId, { httpOnly: true, secure: true });
//     res.status(200).json({ id: user.id, email: user.email })
// } 


async function createUsreHashAndSessionToken(res: Response, credentials: any) {
    const hash = await argon2.hash(credentials.password);
    // console.log(hash);
    const user: DbUser = db.createUser(credentials.email, hash);
    // JSON.stringify(console.log(user));
    // const sessionId = await randomByte(32).then(bytes => bytes.toString('hex'));
    // sessionStore.createSession(sessionId, user);
    let authtoken = createToken(user);
    console.log('SessionID', authtoken);
    // res.cookie('SESSIONID', authtoken, { httpOnly: true, secure: true });
    res.status(200).json({ id: user.id, email: user.email })
}


export async function createUserToken(credentials: any) {
    const hash = await argon2.hash(credentials.password);
    // console.log(hash);
    const user: DbUser = db.createUser(credentials.email, hash);
    console.log('USERS', USERS);
    // JSON.stringify(console.log(user));
    // const sessionId = await randomByte(32).then(bytes => bytes.toString('hex'));
    // sessionStore.createSession(sessionId, user);
    // let authtoken = createToken(user.id.toString());
    // console.log('SessionID', authtoken);
    // res.cookie('SESSIONID', authtoken, { httpOnly: true, secure: true });
    // res.status(200).json({ id: user.id, email: user.email })
}

