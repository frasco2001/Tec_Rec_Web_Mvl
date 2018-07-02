var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var methodOverride = require("method-override");

// Import models
var Articulos = require('./app/models/articulos.js');
var Companias = require('./app/models/companias')

// Connection to DB
var port = process.env.PORT || 8000;
mongoose.connect('mongodb://root:example@localhost:27017/meandb', { auth: { authdb: "admin" } });

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// log to console
app.use(morgan('dev'));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// demo Route (GET http://localhost:8080)
app.get('/', function (req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

var apiRoutes = express.Router();

// Routes
apiRoutes.post('/articulos', function (req, res) {
  if (!req.body.nombre || !req.body.precio || !req.body.codigo) {
    res.json({ succes: false, msg: 'Hay un error al introducir el artículo' });
  } else {
    var newArticulo = new Articulos({
      nombre: req.body.nombre,
      compania: req.body.compania,
      precio: req.body.precio,
      codigo: req.body.codigo
    });
    newArticulo.save(function (err) {
      if (err) {
        res.json({ succes: false, msg: 'La creación del articulo ha tenido un problema' });
      } else {
        res.json({ succes: true, msg: 'Artículo creado satisfactoriamente' });
      }
    });
  }
});

apiRoutes.post('/companias', function (req, res) {
  if (!req.body.nombre) {
    res.json({ succes: false, msg: 'Hay un error al introducir la compania' });
  } else {
    var newCompania = new Companias({
      nombre: req.body.nombre
    });
    newCompania.save(function (err) {
      if (err) {
        res.json({ succes: false, msg: 'La creación de la compania ha tenido un problema' });
      } else {
        res.json({ succes: true, msg: 'Compania creada satisfactoriamente' });
      }
    });
  }
});

apiRoutes.get('/articulos', function (req, res) {
  return Articulos.find({}, function (err, articulos) {
    res.json(articulos);
  });
});


apiRoutes.get('/articulos/:id', function (req, res) {
  Articulos.findById(req.params.id, function (error, articulo) {
    if (error) return res.status(500).send(error);
    res.json(articulo);
  });
});

apiRoutes.get('/companias', function (req, res) {
  return Companias.find({}, function (err, companias) {
    res.json(companias);
  });
});

apiRoutes.put('/articulos/:id', function (req, res) {
  Articulos.findById(req.params.id, function (err, articulo) {
    console.log(req.body);
    if (!req.body.nombre || !req.body.compania || !req.body.precio || !req.body.codigo) {
      res.json({ succes: false, msg: 'Hay un error al introducir el artículo' })
    } else {
      articulo.nombre = req.body.nombre;
      articulo.compania = req.body.compania;
      articulo.codigo = req.body.codigo;
      articulo.precio = req.body.precio;
      articulo.save(function (err) {
        if (err) {
          res.json({ succes: false, msg: 'La modificación del articulo ha tenido un problema' });
        } else {
          res.json({ succes: true, msg: 'Artículo modificado satisfactoriamente' });
        }
      });
    }
  });
});

apiRoutes.delete('/articulos/:id', function (req, res) {
  console.log(req.params.id);
  Articulos.findByIdAndRemove(req.params.id, function (err, articulo) {
    articulo.remove(function(err) {
      if (err) return res.send(500, err.message);
      res.json({message: 'Successfully deleted'});
    });
  });
});

app.use('/api', apiRoutes);

// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);
