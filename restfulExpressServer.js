// 'use strict';
//
// const express = require('express');
// const app = express();
// const fs = require('fs');
// const path = require('path');
// const petsData = path.join(__dirname, 'pets.json')
// const buffer = fs.readFileSync(petsData)
// const pets = JSON.parse(buffer)
//
//
// app.disable('x-powered-by');
// app.set('port', process.env.PORT || 8000);
//
// var morgan = require('morgan');
// app.use(morgan('short'));
//
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
//
// app.get('/pets', function(req, res) {
//   res.send(pets);
// });
//
// app.get('/pets/:index', function(req, res) {
//   var index = Number.parseInt(req.params.index);
//
//   if (Number.isNaN(index) || index < 0 || index >= pets.length) {
//     return res.sendStatus(404);
//   }
//
//   res.send(pets[index]);
// });
//
// app.post('/pets', function(req, res) {
//   var pet = req.body;
//
//   if (!pet) {
//     return res.sendStatus(400);
//   }
//
//   pets.push(pet);
//
//   res.send(pet);
// });
//
// app.put('/pets/:index', function(req, res) {
//   var index = Number.parseInt(req.params.index);
//
//   if (Number.isNaN(index) || index < 0 || index >= pets.length) {
//     return res.sendStatus(404);
//   }
//
//   var pet = req.body;
//
//   if (!pet) {
//     return res.sendStatus(400);
//   }
//
//   pets[index] = pet;
//
//   res.send(pet);
// });
//
// app.delete('/pets/:index', function(req, res) {
//   var index = Number.parseInt(req.params.index);
//
//   if (Number.isNaN(index) || index < 0 || index >= pets.length) {
//     return res.sendStatus(404);
//   }
//
//   var pet = pets.splice(index, 1)[0];
//
//   res.send(pet);
// });
//
// app.listen(app.get('port'), function() {
//   console.log('Listening on', app.get('port'));
// });
//
// module.exports= app

'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const bodyParser = require('body-parser');
const morgan = require('morgan');
const basicAuth = require('basic-auth');

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

app.use(bodyParser.json());

app.disable('x-powered-by');

let auth = function(req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm="Required"');

    return res.sendStatus(401);
  }

  let user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === 'admin' && user.pass === 'meowmix') {
    return next();
  }
  else {
    return unauthorized(res);
  }
};

app.get('/pets', auth, (req, res) => {
  fs.readFile(petsPath, (err, data) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }
    res.set('Content-Type', 'application/json');
    res.send(data);
  });
});

app.get('/pets/:id', auth, (req, res) => {
  fs.readFile(petsPath, (err, data) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }
    let index = parseInt(req.params.id);
    let jsonData = JSON.parse(data);

    if (index < 0 || index >= jsonData.length || isNaN(index)) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'application/json');
    res.send(jsonData[index]);
  });
});

app.post('/pets', auth, (req, res) => {
  if (req.body.name === '' || req.body.age === '' || req.body.kind === '' || isNaN(req.body.age)) {
    return res.sendStatus(400);
  }
  else {
    fs.readFile(petsPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err.stack);

        return res.sendStatus(500);
      }
      let jsonData = JSON.parse(data);

      jsonData.push(req.body);

      fs.writeFile(petsPath, JSON.stringify(jsonData), (writeErr) => {
        console.error(writeErr);
      });
      res.set('Content-Type', 'application/json');
      res.send(req.body);
    });
  }
});

app.patch('/pets/:id', auth, (req, res) => {
  if (req.body.age === '' || isNaN(req.body.age)) {
    return res.sendStatus(400);
  }
  else {
    fs.readFile(petsPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err.stack);

        return res.sendStatus(500);
      }

      let jsonData = JSON.parse(data);
      let index = parseInt(req.params.id);

      if (index < 0 || index >= jsonData.length || isNaN(index)) {
        return res.sendStatus(404);
      }
      else {
        for (let key in req.body) {
          jsonData[index][key] = req.body[key];
        }
      }
      fs.writeFile(petsPath, JSON.stringify(jsonData), (writeErr) => {
        console.error(writeErr);
      });
      res.set('Content-Type', 'application/json');
      res.send(jsonData[index]);
    });
  }
});

app.delete('/pets/:id', auth, (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);

      return res.sendStatus(500);
    }
    else {
      let index = parseInt(req.params.id);
      let jsonData = JSON.parse(data);

      if (index < 0 || index >= jsonData.length || isNaN(index)) {
        return res.sendStatus(404);
      }
      let deletedPet = jsonData[index];

      jsonData.splice(index, 1);

      fs.writeFile(petsPath, JSON.stringify(jsonData), (writeErr) => {
        console.error(writeErr);
      });

      res.set('Content-Type', 'application/json');
      res.send(deletedPet);
    }
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(port, function(err) {
  if (err) throw err;
  console.log('Listening on port', port);
});

module.exports = app;
