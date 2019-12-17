import * as express from "express";
import * as https from "https";
import * as fs from "fs";
import { Application } from "express";
import {
  createUser,
  logOut,
  login,
  createUserToken,
  CreateDbUsers,
  AddRolesToUser,
  waitTIllAllUserCreation,
  saveImage
} from "./create-user.route";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { getUser } from "./get-user.route";
import { getAllMembers } from "./get-all-members.route";
import { retrieveUserIdFromRequest } from "./get-user.middleware";
import {
  checkIfAuthenticated,
  checkIfAuthorized
} from "./authetication.middleware";
import * as _ from "lodash";
import { isValidAuthToken } from "./session-jwt";
import mime = require("mime");
import { retrieveImage } from './images.route';
const AWS = require("aws-sdk");
const app: Application = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(retrieveUserIdFromRequest);
const commandLineArgs = require("command-line-args");

const optionDefinitions = [
  { name: "secure", type: Boolean, defaultOption: false }
];

const options = commandLineArgs(optionDefinitions);
if (options.secure) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("ssl/server.key"),
      cert: fs.readFileSync("ssl/server.crt")
    },
    app
  );
  // launch an HTTPS Server. Note: this does NOT mean that the application is secure
  httpsServer.listen(9000, () =>
    console.log(
      "HTTPS Secure Server running at https://localhost:" +
        httpsServer.address().port
    )
  );
  // createUserToken({email:'pawank.kumawat@gmail.com',password:'password'});
  waitTIllAllUserCreation();
} else {
  // launch an HTTP Server
  const httpServer = app.listen(9000, () => {
    console.log(
      "HTTP Server running at https://localhost:" + httpServer.address().port
    );
  });
  waitTIllAllUserCreation();
}

app.route("/api/signup").post(createUser);

app.route("/api/getUser").get(checkIfAuthenticated, getUser);

app
  .route("/api/getAllMembers")
  .get(
    checkIfAuthenticated,
    _.partial(checkIfAuthorized, ["ADMIN"]),
    getAllMembers
  );
app.route("/api/logOut").post(checkIfAuthenticated, logOut);

app.route("/api/login").post(login);
app.route("/api/isValidAuthToken").get(isValidAuthToken);

const multer = require("multer");
const fileNameCreator = {
  count: 0
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/public/uploads/");
  },
  filename: function(req, file, cb) {
    fileNameCreator.count = fileNameCreator.count + 1;
    cb(
      null,
      // file.fieldname + "-" +
      fileNameCreator.count + "." + mime["extension"](file.mimetype)
    );
  }
});

// const upload = multer({ dest: __dirname + "/public/uploads/" });
const upload = multer({ storage: storage });

const s3 = new AWS.S3({
  accessKeyId: "AKIAWEVM32S3TOW2SFU3",
  secretAccessKey: "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"
});

const uploadFile = () => {
  const fileName =
    __dirname + "/public/uploads/" + fileNameCreator.count + ".png";
  fs.readFile(fileName, (err, data) => {
    if (err) throw err;
    const params = {
      Bucket: "aa-server-v1", // pass your bucket name
      Key: "1/" + fileNameCreator.count + ".png", // file will be saved as testBucket/contacts.csv
      Body: JSON.stringify(data, null, 2)
    };
    s3.upload(params, function(s3Err, data) {
      if (s3Err) throw s3Err;
      console.log(`File uploaded successfully at ${data.Location}`);
    });
  });
};

app.post("/api/image", upload.single("file"), function(req, res, next) {
  console.log("avatar", req["file"]); //is the `avatar` file
  // req.body will hold the text fields, if there were any
  // uploadFile();
  newUploadtoS3();
  return res.status(200).json({ status: "success" });
});

function newUploadtoS3() {
  s3.putObject({
    Bucket: "aa-server-v1",
    Body: fs.readFileSync(
      __dirname + "/public/uploads/" + fileNameCreator.count + ".png"
    ),
    Key:"1/"+ fileNameCreator.count + ".png"
  })
    .promise()
    .then(response => {
      console.log(`done! - `, response);
      console.log(
        `The URL is ${s3.getSignedUrl("getObject", {
          Bucket: "aa-server-v1",
          Key: "1/"+ fileNameCreator.count + ".png"
        })}`
      );
    })
    .catch(err => {
      console.log("failed:", err);
    });
}

app.route("/api/retrieveimg").get(retrieveImage);
