import * as  crypto from 'crypto';
import * as util from 'util';
import { Moment } from 'moment'
import moment = require('moment');
// crypto.randomBytes(256, (err, buf) => {
//     if (err) throw err;
//     console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
// });

export const randomByte = util.promisify(crypto.randomBytes);

export interface User {
    id: number;
    email: string;

}
export class Session {
    static readonly VALIDITY_MINUTES = 10;
    private validUntil: Moment;
    constructor(public sessionId: string, public user: User) {

        this.validUntil = moment().add(Session.VALIDITY_MINUTES, 'minutes');
    }

    isValid() {
        return moment().diff(this.validUntil, 'minutes') <= 0;
    }
}

