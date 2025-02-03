const express = require('express');
const router = express.Router();
const Obra = require('../models/database_schema.js');

// Pega todas obras
router.get('/obras', async (req, res) => {
  try {
    const obras = await Obra.find();
    res.json(obras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pega obra por nome
router.get('/obras/:nome', async (req, res) => {
  try {
    const obra = await Obra.findOne({ nome: req.params.nome });
    if (!obra) {
      return res.status(404).json({ message: 'Obra não encontrada' });
    }
    res.json(obra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adiciona nova obra
router.post('/obras', async (req, res) => {
  const obra = new Obra({
    nome: req.body.nome,
    personagens: req.body.personagens
  });

  try {
    const novaObra = await obra.save();
    res.status(201).json(novaObra);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualiza a obra
router.put('/obras/:nome', async (req, res) => {
  try {
    const obra = await Obra.findOneAndUpdate(
      { nome: req.params.nome },
      req.body,
      { new: true }
    );
    if (!obra) {
      return res.status(404).json({ message: 'Obra não encontrada' });
    }
    res.json(obra);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleta a obra
router.delete('/obras/:nome', async (req, res) => {
  try {
    const obra = await Obra.findOneAndDelete({ nome: req.params.nome });
    if (!obra) {
      return res.status(404).json({ message: 'Obra não encontrada' });
    }
    res.json({ message: 'Obra deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// Pega todos personagens da obra
router.get('/obras/:nome/personagens', async (req, res) => {
  try {
    const obra = await Obra.findOne({ nome: req.params.nome });
    if (!obra) return res.status(404).json({ message: 'Obra não encontrada' });
    res.json(obra.personagens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adiciona personagem a obra
router.post('/obras/:nome/personagens', async (req, res) => {
  try {
    const obra = await Obra.findOne({ nome: req.params.nome });
    if (!obra) return res.status(404).json({ message: 'Obra não encontrada' });
    
    obra.personagens.push(req.body);
    const updatedObra = await obra.save();
    res.status(201).json(updatedObra.personagens[updatedObra.personagens.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualiza personagem na obra
router.put('/obras/:nomeObra/personagens/:nomePersonagem', async (req, res) => {
  try {
    const obra = await Obra.findOne({ nome: req.params.nomeObra });
    if (!obra) return res.status(404).json({ message: 'Obra não encontrada' });

    const personagemIndex = obra.personagens.findIndex(p => p.nome === req.params.nomePersonagem);
    if (personagemIndex === -1) return res.status(404).json({ message: 'Personagem não encontrado' });

    obra.personagens[personagemIndex] = { ...obra.personagens[personagemIndex], ...req.body };
    const updatedObra = await obra.save();
    res.json(updatedObra.personagens[personagemIndex]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleta personagem na obra
router.delete('/obras/:nomeObra/personagens/:nomePersonagem', async (req, res) => {
  try {
    const obra = await Obra.findOne({ nome: req.params.nomeObra });
    if (!obra) return res.status(404).json({ message: 'Obra não encontrada' });

    obra.personagens = obra.personagens.filter(p => p.nome !== req.params.nomePersonagem);
    await obra.save();
    res.json({ message: 'Personagem removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;