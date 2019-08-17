// openssl genrsa -des3 -out private.pem 2048
// openssl rsa -in private.pem -outform PEM -pubout -out public.pem
// password
import * as jwt from 'jsonwebtoken';
import { Response, Request } from 'express';
import * as fs from "fs";
import { DbUser } from './database-data';
const RSA_PRIVATE_KEY = fs.readFileSync('./private.pem');

const RSA_PUBLIC_KEY = fs.readFileSync('./public.pem');



export function createToken(user: DbUser) {
    let token = jwt.sign({ roles: user.roles }, { key: RSA_PRIVATE_KEY, passphrase: 'password' },
        {
            algorithm: 'RS256',
            expiresIn: 3600,
            subject: user.id.toString()
        });
    return token;
}


export function verifyToken(token) {
    let decoded = jwt.verify(token, RSA_PUBLIC_KEY);
    return decoded;
}

export function isValidAuthToken(req: Request, res: Response) {
    const authtoken = req.headers['authtoken'];
    if (authtoken) {
        try {
            let user = verifyToken(authtoken);
            if (user) {
                res.status(200).send(true);
            } else {
                res.status(200).send(false);
            }
        } catch{
            res.status(200).send(false);
        }
    } else {
        res.status(200).send(false);
    }
}