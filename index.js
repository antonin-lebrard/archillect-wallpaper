'use strict';

const http = require('http');
const fs = require('fs');
const wallpaper = require('wallpaper');

const UriArchillect = 'http://archillect.com/';
const ContainerElement = '<div id="container">';
const ImgElement = '<img id="ii" src=';

const tempFilePath = "./tmp.jpg";

/**
 * @param {string} body
 * @returns {string}
 */
function getUriArchillectImagePage (body) {
  if (body.length === 0)
    return '';
  let firstAElementIndex = body.indexOf('<a ', body.indexOf(ContainerElement));
  let hrefIndex = body.indexOf('/', firstAElementIndex) + 1;
  let closingHrefIndex = body.indexOf('>', hrefIndex);
  if (hrefIndex === -1 || closingHrefIndex === -1)
    return '';
  return UriArchillect + body.substring(hrefIndex, closingHrefIndex);
}

/**
 * @param {string} body
 * @returns {string}
 */
function getImgFullPath (body) {
  if (body.length === 0)
    return '';
  let srcIndex = body.indexOf(ImgElement) + ImgElement.length;
  let srcEndIndex = body.indexOf('/>', srcIndex);
  if (srcIndex === -1 || srcEndIndex === -1)
    return '';
  return body.substring(srcIndex, srcEndIndex);
}

/**
 * Fill the host and port, if you're behind a proxy
 * @param {string} uri the actual url requested
 * @returns {{host: string, port: string, path: *, method: string, headers: {Host: string}}}
 */
function constructProxyRequestObj (uri) {
  return {
    host: "proxy ip address here", // TODO: fill with proxy ip
    port: "proxy port here",       // TODO: fill with port here
    path: uri,
    method: "GET",
    headers: {
      Host: "archillect.com"
    }
  }
}

/**
 * @param {string|Object} uri
 * @param callback
 */
function request (uri, callback) {
  let req = http.request(uri, (resp) => {
    let body = "";
    resp.on('data', (chunk) => body += chunk);
    resp.on('end', () => callback(null, body));
    resp.on('error', (err) => {
      console.error(err);
      callback(err);
    })
  });
  req.on('error', (err) => {
    console.error(err);
    callback(err);
  });
  req.end();
}

/**
 * @param {string|Object} uri
 * @param {string} filepath
 * @param callback
 */
function downloadIntoFile(uri, filepath, callback) {
  let fileWriteStream = fs.createWriteStream(filepath, 'binary');
  let req = http.request(uri, (resp) => {
    resp.pipe(fileWriteStream);
    resp.on('error', (err) => {
      console.error(err);
      callback(err);
    });
    fileWriteStream.on('close', () => callback());
  });
  req.on('error', (err) => {
    console.error(err);
    callback(err);
  });
  req.end();
}

function wholeTask(isBehindProxy = false) {
  let mainPageUri = isBehindProxy ? constructProxyRequestObj(UriArchillect) : UriArchillect;
  request(mainPageUri, (err, mainPageBody) => {
    if (err) return;
    let imagePageUri = getUriArchillectImagePage(mainPageBody);
    if (isBehindProxy)
      imagePageUri = constructProxyRequestObj(imagePageUri);
    request(imagePageUri, (err, imagePageBody) => {
      if (err) return;
      let imageUri = getImgFullPath(imagePageBody);
      if (isBehindProxy)
        imageUri = constructProxyRequestObj(imageUri);
      downloadIntoFile(imageUri, tempFilePath, (err) => {
        if (err) return;
        // TODO : you may want to change the scale value, available : 'fill, fit, stretch, center'
        wallpaper.set(tempFilePath, { scale: 'center' })
          .then(() => console.log("Successfully set wallpaper"))
          .catch((err) => console.error(err));
      });
    });
  });
}

// archillect post one image each 10 minutes, no need to re-fetch it
setInterval(wholeTask, 10 * 60 * 60 * 1000); // 10 minutes
// launch at least one time to not wait first 10 minutes
wholeTask();