const express = require('express');
const router = express.Router();
const Obra = require('../models/models.js');
const mongoose = require('mongoose');

// Pega todas obras
router.get('/obras', async (req, res) => {
  try {
    const obras = await Obra.find();
    res.json(obras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pega obra por ID - (Faz a mesma coisa, e melhor doque "Pegar todos os personagens")
router.get('/obras/:id', async (req, res) => {
  try {
    const obra = await Obra.findById(req.params.id);
    if (!obra) return res.status(404).json({ message: 'Obra não encontrada' });
    res.json(obra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adiciona nova obra
router.post('/obras', async (req, res) => {
  const obra = new Obra(req.body);
  try {
    const novaObra = await obra.save();
    res.status(201).json(novaObra);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// WIP - Atualiza a obra
router.put('/obras/:id', async (req, res) => {
  try {
    const obra = await Obra.updateOne({ _id: req.params.id }, req.body);
    if (!obra.matchedCount) return res.status(404).json({ message: 'Obra não encontrada' });
    res.json(obra);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleta a obra
router.delete('/obras/:id', async (req, res) => {
  try {
    const obra = await Obra.deleteOne({ _id: req.params.id });
    if (!obra.deletedCount) return res.status(404).json({ message: 'Obra não encontrada' });
    res.json({ message: 'Obra deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Por enquanto nao utilizavel - Pega todos personagens da obra
/*router.get('/obras/:id/personagens', async (req, res) => {
  try {
    const obra = await Obra.findById(req.params.id);
    if (!obra) return res.status(404).json({ message: 'Obra não encontrada' });
    res.json(obra.personagens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/

// Adiciona personagem a obra
router.post('/obras/:id/personagens', async (req, res) => {
  try {
    let charactersData = req.body;
    // Se não for um array, transforma em array para unificar o tratamento
    if (!Array.isArray(charactersData)) {
      charactersData = [charactersData];
    }
    
    const result = await Obra.updateOne(
      { _id: req.params.id },
      { $push: { characters: { $each: charactersData } } }
    );
    
    if (!result.matchedCount)
      return res.status(404).json({ message: 'Obra não encontrada' });
      
    res.status(201).json({ added: charactersData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// WIP Atualiza personagem na obra
router.put('/obras/:obraId/personagens/:personagemId', async (req, res) => {
  try {
    const obra = await Obra.updateOne(
      { _id: req.params.obraId, 'personagens._id': req.params.personagemId },
      { $set: { 'personagens.$': req.body } }
    );
    if (!obra.matchedCount) return res.status(404).json({ message: 'Personagem não encontrado' });
    res.json(req.body);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleta personagem na obra
router.delete('/obras/:obraId/personagens/:personagemId', async (req, res) => {
  try {
    const obraId = new mongoose.Types.ObjectId(req.params.obraId);
    const personagemId = new  mongoose.Types.ObjectId(req.params.personagemId);

    const obra = await Obra.updateOne(
      { _id: obraId },
      { $pull: { characters: { _id: personagemId } } }
    );

    if (!obra.matchedCount) return res.status(404).json({ message: 'Obra não encontrada!' });
    if (!obra.modifiedCount) return res.status(404).json({ message: 'Personagem não encontrado na obra!' });

    res.json({ message: 'Personagem removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;