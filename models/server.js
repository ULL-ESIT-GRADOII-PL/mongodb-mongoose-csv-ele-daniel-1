/* jshint  esversion: 6 */
'use strict';

var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let csvSchema = new Schema({
  username: String,
  nameSave: String,
  csv: String,
});


class CsvModel {

    constructor() {
        mongoose.connect('mongodb://localhost/csv');
        this.Csv = mongoose.model('Csv', csvSchema);
    }

    disconect() {
        mongoose.connection.close();
    }

    /*
     * Recieve user and name of file with its contents in csv
     */
    saveCsvInDb(user, name, csv) {
        var input = new this.Csv({ username: user, nameSave: name, csv: csv});
        input.save((err) => {
            if (err) {
                console.log(err);
            }
        });
        this.disconect();
    }

    getCsvList(user) {
        this.Csv.find({ username: user });
        this.disconect();
    }

    /*
     * Load a determinate csv file database if no found its return -1
     */
    loadCsv(user, name) {
        let result = -1;
        this.Csv.findOne( { username: user, nameSave: name }, (err, selected) => {
            if (err) {
                console.log(`No found: ${user} --- ${name} --- ${err}`);
            }
            result = selected.csv;
        });
        this.disconect();
        return result;
    }
}

module.exports = CsvModel;


