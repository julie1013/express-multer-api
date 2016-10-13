#!/usr/bin/env node

'use strict';

const fs = require('fs');
const fileType = require('file-type');

const filename = process.argv[2] || '';

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        reject(error);
      }

      resolve(data);
    });
  });
};

//return a default object in the case that fileType is given an unsupported
//file type to read
const mimeType = (data) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(data));
};

const parseFile = (fileBuffer) => {
  let file = mimeType(fileBuffer);
  file.data = fileBuffer;
  return file;
};

const upload = (file) => {
  const options = {
    //get the bucket name from your AWS S3 console
    Bucket: 'julie1013',
    //attach the fileBuffer as a stream to send to Amazon
    Body: file.data,
    //allow anyone to access the URL of the uploaded file
    ACL: 'public-read',
    //tell S3 what the mime-type is
    ContentType: file.mime,
    //pick a filename for S3 to use for the upload
    Key: `test/test.${file.ext}`
  };
  //don't actually upload yet; just pass the data down the Promise chain
  return Promise.resolve(options);
};

const logMessage = (upload) => {
  //get rid of the stream for now, so I can log the rest of my options in the
  //terminal without seeing the stream
  delete upload.Body;
  //turn the pojo into a string so I can see it in the console.
  console.log(`The upload options are ${JSON.stringify(upload)}`);
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error);
