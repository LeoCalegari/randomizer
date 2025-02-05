const express = require('express');
const router = express.Router();
const Obra = require('../models/models.js');
const mongoose = require('mongoose');

// Bulk import de todos personagens e obras (cria todos personagens e obras - pra agilizar pro pai, mo preguica)
router.post('/personagens/bulk-import', async (req, res) => {
  try {
    const importData = req.body;
    const resultados = [];

    for (const obraData of importData) {
      // Encontra ou cria a obra
      let obra = await Obra.findOne({ title: obraData.obraTitle });

      if (!obra) {
        obra = new Obra({ title: obraData.obraTitle });
      }

      // Filtra personagens para remover duplicatas
      const existingCharacterNames = new Set(
        obra.characters.map(c => c.name.toLowerCase())
      );

      const novosPersonagens = obraData.characters.filter(
        character => !existingCharacterNames.has(character.name.toLowerCase())
      );

      // Adiciona novos personagens
      obra.characters.push(...novosPersonagens);

      // Salva a obra
      await obra.save();

      resultados.push({
        obra: obraData.obraTitle,
        totalPersonagens: obraData.characters.length,
        personagensAdicionados: novosPersonagens.length,
        personagensSkipped: obraData.characters.length - novosPersonagens.length
      });
    }

    res.status(201).json({
      message: 'Importação concluída',
      resultados
    });

  } catch (error) {
    console.error('Erro na importação em massa:', error);
    res.status(500).json({
      message: 'Erro na importação de personagens',
      error: error.message
    });
  }
});

// Pega todas obras
router.get('/obras', async (req, res) => {
  try {
    const obras = await Obra.find();
    res.json(obras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pega obra por ID - (Faz a mesma coisa que "Pegar todos os personagens por obra")
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
    const obraId = req.params.id;
    let charactersData = req.body;

    // Se não for um array, transforma em array
    if (!Array.isArray(charactersData)) {
      charactersData = [charactersData];
    }

    // Encontra a obra
    const obra = await Obra.findById(obraId);
    if (!obra) {
      return res.status(404).json({ message: 'Obra não encontrada' });
    }

    // Filtra personagens para remover duplicatas
    const existingCharacterNames = obra.characters.map(c => c.name);
    const uniqueCharacters = charactersData.filter(
      character => !existingCharacterNames.includes(character.name)
    );

    // Adiciona apenas personagens únicos
    obra.characters.push(...uniqueCharacters);

    // Salva a obra
    await obra.save();

    res.status(201).json({
      added: uniqueCharacters,
      total: uniqueCharacters.length,
      skipped: charactersData.length - uniqueCharacters.length
    });
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
    const personagemId = new mongoose.Types.ObjectId(req.params.personagemId);

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