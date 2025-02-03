const mongoose = require('mongoose');

const personagemSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
    enum: ['M', 'F'],
    required: false
  },
  variacaoList: {
    type: [String],
    default: []
  },
  numeroReferencia: {
    type: String,
    required: false
  }
});

const obraListSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  personagens: [personagemSchema]
});

module.exports = mongoose.model('ObraList', obraListSchema);