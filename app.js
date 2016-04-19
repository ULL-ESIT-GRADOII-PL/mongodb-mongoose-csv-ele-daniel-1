"use esversion: 6";

express = require('express');
app = express();
path = require('path');
expressLayouts = require('express-ejs-layouts');

app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

calculate = require('./models/calculate');

app.get('/', (request, response) => {
	response.render('index', {title: 'CSV Analizer'});
});

app.get('/csv', (request, response) => { //
	response.send({"rows": calculate(request.query.input)}); // Solo se envian los datos necesarios, no una vista de ahi a que no se use render
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
