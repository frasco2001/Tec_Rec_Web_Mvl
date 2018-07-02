var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ArticulosSchema = new Schema({
    nombre: { type: String },
    precio: { type: Number },
    codigo: { type: String },
    compania: { type: String },
    activo: { type: Boolean, default: 'TRUE' },
    create_time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Articulos', ArticulosSchema);
