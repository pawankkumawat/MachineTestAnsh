import { Session } from "./session";
import { User } from 'src/app/models/user';

class SessionStore {

    private sessions: { [key: string]: Session } = {};

    createSession(sessionId: string, user: User) {
        this.sessions[sessionId] = new Session(sessionId, user);
    }
    getUser(sessionId) {
        if (sessionId) {
            let session: Session = this.sessions[sessionId];
            return session && session.user ? session.user : undefined;
        } else {
            return undefined;
        }
    }

    isSessionValid(sessionId: string) {
        let session = this.sessions[sessionId];
        return session && session.isValid();
    }

    deleteSession(sessionId: any): any {
        delete this.sessions[sessionId];
    }
}

export const sessionStore = new SessionStore();