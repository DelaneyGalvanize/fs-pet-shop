'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan');

let app = express();
let petsPath = path.join(__dirname, 'pets.json');
let port = process.env.PORT || 8000;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.get('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      res.sendStatus(500);
    }
    res.set('Content-Type', 'application/json')
    res.send(petsJSON);
  });
});

app.get('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsData) {
    if (err) {
      res.sendStatus(500);
    }
    let id = Number.parseInt(req.params.id);
    let parsedPets = JSON.parse(petsData);
    if (id < 0 || id >= parsedPets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(parsedPets[id]));
  });
});

app.post('/pets', function(req, res) {
  let name = req.body.name
  let age = req.body.age
  let kind = req.body.kind
  if (!name || !age || !kind) {
    res.sendStatus(400)
  } else {
    let newPet = {
      'name': name,
      'age': age,
      'kind': kind
    }
    fs.readFile(petsPath, 'utf8', function(err, petsData) {
      if (err) {
        res.sendStatus(500);
      }
      let parsedPets = JSON.parse(petsData)
      parsedPets.push(req.body)
      petsData = JSON.stringify(parsedPets)
      fs.writeFile(petsPath, petsData, function(err) {
        if (err) throw error;
        res.send((req.body))
      })
    })
  }
})
app.patch('/pets/:id', function(req, res) {
  let name = req.body.name
  let age = req.body.age
  let kind = req.body.kind

  if (!name && (!age || typeof age !== 'number') && !kind) {
    res.sendStatus(400)
  } else {
    fs.readFile(petsPath, 'utf8', function(err, petsData) {
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      let parsedPets = JSON.parse(petsData)
      if (name) parsedPets[req.params.id].name = name;
      if (age && typeof age === 'number') parsedPets[req.params.id].age = age;
      if (kind) parsedPets[req.params.id].kind = kind;

      petsData = JSON.stringify(parsedPets)
      fs.writeFile(petsPath, petsData, function(err){
        if (err) throw error;
        res.send(parsedPets[req.params.id])
      })
    })
  }
})

app.delete('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsData) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    let parsedPets = JSON.parse(petsData)
    let gone = parsedPets.splice(req.params.id, 1)
    petsData = JSON.stringify(parsedPets)
    fs.writeFile(petsPath, petsData, function(err) {
      if (err) throw error;
      res.send(gone[0])
    })
  })
})
app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function(){
  console.log('Listening on port', port);
});

module.exports = app;
