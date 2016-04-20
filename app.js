"use esversion: 6";

var express = require('express');
var app = express();
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/csv');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var csvSchema = new Schema({
  username: String,
  csv: String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});

var Csv = mongoose.model("Csv", csvSchema);


// estas funciones debe estar en una clase para que tengan acceso al model y la base de datos
var saveCsvInDb = (data) => {
    
};

var getCsvList = (user) => {
    
}

app.set('port', (process.env.PORT || 5000));
app.set('ip', (process.env.IP || "0.0.0.0"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

var calculate = require('./models/calculate');

app.get('/', (request, response) => {
	response.render('index', {title: 'CSV Analizer'});
});

app.get('/csv', (request, response) => {
	response.send({"rows": calculate(request.query.input)}); // Solo se envian los datos necesarios, no una vista de ahi a que no se use render
});

app.get('/users/:id', (request, response) => {
    response.send({ "listExamples": getCsvList(request.params.id) });
});


app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
