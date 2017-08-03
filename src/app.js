import express from 'express';
import mongoose from 'mongoose';
import { searchAPI } from './api/search';
import { searchApi } from './api/search';

const mongodb = 'mongodb://rharki:rharki123@ds129043.mlab.com:29043/imageabstractionlayerhistory';
mongooseInit(mongodb);

function mongooseInit(mongodb) {
  // mongoose.Promise = global.Promise;
  console.log('mongodb connection request sent!')
  mongoose.connect(mongodb);
}

export const app = express(); // We export app so index.js can make use of it
console.log('reaching till here')

app.use('/api', searchApi);


  // do the magic of getting the search results, parsing them into the 4 params and sending them back to the user
  // response.end("Testing has ended !!!");


app.get("/hello/:who", function(req, res) {
  res.end("Hello, " + req.params.who + ".");
  // Fun fact: this has security issues
});

app.get("/", function(req, res) {
  res.end("Sorry, but the image search abstraction layer is not available here!");
  // Fun fact: this has security issues
});