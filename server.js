'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;


const dns = require('dns');
const { URL } = require('url');


mongoose.connect('mongodb+srv://vanxuat:canhavuive12@cluster0-culpo.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true });


const urlSave = require('./model/db');
app.use(bodyParser.urlencoded({extended: false}));
const urlShort =function(url, callback) {
  
  let longUrl = null;
  let err = null;
  try {
    longUrl = new URL(url);
  } catch (err) {
    return callback(err, null);
  }
  dns.lookup(longUrl.hostname, (err, address, family) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, longUrl.origin);
  }); 
  
};

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/shorturl/new',(req,res)=>{
  
   const newLongUrl = req.body.url;
  urlShort(newLongUrl, function (err, url) {
    if (err) {
      console.error("Error: Url didn't validate:");
      console.error(err);      
      res.json({error: 'invalid url'});      
    } else {      
      urlSave.createNew(url, function(err, shortUrl) {
        if (err) {
          console.error('Error: fail with database');
          console.error(err);
          res.send('Error with database.');
        } else {
          res.json({original_url: url, short_url: shortUrl});
        }
      });
    }
  });
  
});
app.listen(port, function () {
  console.log('Node.js listening ...');
});