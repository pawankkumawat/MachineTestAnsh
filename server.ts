import * as express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import { Application } from "express";
import { createUser, logOut, login, createUserToken, CreateDbUsers, AddRolesToUser, waitTIllAllUserCreation } from './create-user.route';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { getUser } from './get-user.route';
import { getAllMembers } from './get-all-members.route';
import { retrieveUserIdFromRequest } from './get-user.middleware';
import { checkIfAuthenticated, checkIfAuthorized } from './authetication.middleware';
import * as _ from 'lodash'
import { isValidAuthToken } from './session-jwt';
const app: Application = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(retrieveUserIdFromRequest);
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'secure', type: Boolean, defaultOption: false },
];

const options = commandLineArgs(optionDefinitions);
if (options.secure) {
    const httpsServer = https.createServer({
        key: fs.readFileSync('ssl/server.key'),
        cert: fs.readFileSync('ssl/server.crt')
    }, app);
    // launch an HTTPS Server. Note: this does NOT mean that the application is secure
    httpsServer.listen(9000, () => console.log("HTTPS Secure Server running at https://localhost:" + httpsServer.address().port));
    // createUserToken({email:'pawank.kumawat@gmail.com',password:'password'});
    waitTIllAllUserCreation()
}
else {
    // launch an HTTP Server
    const httpServer = app.listen(9000, () => {
        console.log("HTTP Server running at https://localhost:" + httpServer.address().port);
    });
    waitTIllAllUserCreation();
}

app.route('/api/signup')
    .post(createUser);

app.route('/api/getUser')
    .get(checkIfAuthenticated,getUser);

app.route('/api/getAllMembers')
    .get(checkIfAuthenticated, _.partial(checkIfAuthorized,['ADMIN']), getAllMembers);
app.route('/api/logOut')
    .post(checkIfAuthenticated, logOut);

app.route('/api/login')
    .post(login);
app.route('/api/isValidAuthToken')
    .get(isValidAuthToken);


    