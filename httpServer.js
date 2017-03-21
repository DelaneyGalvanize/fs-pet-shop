'use strict';

const fs = require('fs');
const path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

const http = require('http');
var port = process.env.PORT || 8000;

var server = http.createServer(function(req, res) {
  if (req.method === 'GET' && req.url === '/pets') {
    fs.readFile(petsPath, 'utf8', function(err, petsData) {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Internal Server Error');
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(petsData);
    });
  }
  else if (req.method === 'GET' && req.url === '/pets/0') {
    fs.readFile(petsPath, 'utf8', function(err, petsData) {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Internal Server Error');
      }

      var parsedPets = JSON.parse(petsData);
      var petsData = JSON.stringify(parsedPets[0]);

      res.setHeader('Content-Type', 'application/json');
      res.end(petsData);
    });
  }
  else if (req.method === 'GET' && req.url === '/pets/1') {
    fs.readFile(petsPath, 'utf8', function(err, petsData) {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Internal Server Error');
      }

      var parsedPets = JSON.parse(petsData);
      var petsData = JSON.stringify(parsedPets[1]);

      res.setHeader('Content-Type', 'application/json');
      res.end(petsData);
    });
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = server;
