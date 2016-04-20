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

var calculate = require('./models/calculate');

app.get('/', (request, response) => {
	response.render('index', {title: 'CSV Analizer'});
});

app.get('/csv', (request, response) => {
	response.send({'rows': calculate(request.query.input)});
    // Solo se envian los datos necesarios, no una vista de ahi a que no se use render
});

app.get('/users/:id', (request, response) => {
    response.send({ 'listExamples': getCsvList(request.params.id) });
});


app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
