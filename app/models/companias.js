var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CompaniasSchema = new Schema({
    nombre: String,
    activo: { type: Boolean, default: 'TRUE' },
    create_time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Compañias', CompaniasSchema);
