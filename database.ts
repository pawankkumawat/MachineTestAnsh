import { USERS, Members, } from './database-data';
import * as _ from 'lodash';
import { DbUser } from 'models';
class InMemoryDataBase {
    counter = 0;
    createUser(email, password, roles = [], permissions = [
        'CheckPoint_View',
        'CheckPoint_Create',
        'CheckPoint_Update',
        'CheckPoint_Delete'
    ]): DbUser {
        const id = ++this.counter;
        const user: DbUser = {
            id,
            email,
            password,
            roles,
            permissions
        }
        USERS[id] = user;
        // console.log('User created', user)
        return user;
    }

    getAllMembers() {
        return _.values(Members);
    }

    getUserByEmail(email) {
        let user = _.values(USERS).find(element => element.email == email);
        return user;
    }

    getUserById(id) {
        let user = _.values(USERS).find(element => element.id == id);
        return user;
    }

}

export const db = new InMemoryDataBase()