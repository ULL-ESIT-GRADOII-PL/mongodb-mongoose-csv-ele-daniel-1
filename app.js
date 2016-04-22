/* jshint  esversion: 6 */
'use strict';

var express = require('express');
var app = express();
var path = require('path');
var expressLayouts = require('express-ejs-layouts');

app.set('port', (process.env.PORT || 5000));
app.set('ip', (process.env.IP || '0.0.0.0'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

var MongoDb = require('./models/mongodb.js');
var calculate = require('./models/calculate');

app.get('/', (request, response) => {
	response.render('index', {title: 'CSV Analizer'});
});

/*
 * Mantenemos la misma funcionalidad anterior, se puede usar el servicio
 */
app.get('/csv', (request, response) => {
	response.send({'rows': calculate(request.query.input)});
});

/*
 * Se devuelve una lista de csv guardados
 */
app.get('/getCsvs', (request, response) => {
    let csv = new MongoDb();
    csv.getCsvList().then((value) => {
        console.log(value);
        response.send({ 'csvFiles': value });
    });
});

/*
 * Se obtiene el csv apartir de una peticion del cliente mediante ajax
 */
app.get('/getCsvfile', (request, response) => {
    let csv = new MongoDb();
    csv.loadCsv(request.query.csvfile)
        .then((value) => {
            response.send({'content': value});
        });
});

/*
 * Se envia un csv
 */
app.get('/sendCsvfile', (request, response) => {
    let req = request.query;
    let csv = new MongoDb();
    console.log("sendCsvfile: " + req.name + "  " + req.csv) ;
    csv.saveCsvInDb(req.name, req.csv);
    response.send({'status': "ok"});
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
