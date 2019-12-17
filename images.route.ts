import { Response, Request } from "express";
import { Observable,  of, forkJoin } from 'rxjs';
import * as AWS from "aws-sdk";
var async = require('async');
const BucketName = "aa-server-v1";

const s3 = new AWS.S3({
  accessKeyId: "AKIAWEVM32S3TOW2SFU3",
  secretAccessKey: "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"
});


export function retrieveImage(req: Request, res: Response) {
  var params: AWS.S3.GetObjectRequest = {
    Bucket: BucketName,
    Key: "1/1.png"
  };

 
}


async function listAllObjects (){
  await   s3.listObjectsV2(
        {
          Bucket: BucketName,
          Delimiter: "/",
          Prefix: "1/"
        },
        (err, data) => {
          if (err) {
            return "There was an error viewing your album: " + err.message;
          } else {
            console.log(data.Contents, "<<<all content");
            let image$ :Observable<any>[]=[];
            data.Contents.forEach(function(obj, index) {
              console.log(obj.Key, "<<<file path");
            });
            
            // let imgKey= data.Contents[data.Contents.length-1].Key
            // s3.getObject(
            //     {
            //       Bucket: BucketName,
            //       Key: imgKey
            //     },
            //     (err, data)=> {
            //       let buff = data.Body as Buffer;
            //        res.json(buff.toString("base64"));
            //     });
          }
        });
}