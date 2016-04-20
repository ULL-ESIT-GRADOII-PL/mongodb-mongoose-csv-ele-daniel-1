/* jshint  esversion: 6 */

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

let server = require('./models/server.js');
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
 * Se devuelve una lista de csv guardados con ese usuario
 */
app.get('/users/:id', (request, response) => {
    let csv = new server.CsvModel();
    response.send({ 'listExamples': csv.getCsvList(request.params.id) });
});

/*
 * Se obtiene el csv apartir de una peticion del cliente mediante ajax
 */
app.get('/csvfile', (request, response) => {
    let req = request.query;
    let csv = new server.CsvModel();
    response.send({'csvfile': csv.loadCsv(request.setAttributeNode(req.user, req.name))});
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
