const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout depois de 5s invés de 30s
      heartbeatFrequencyMS: 1000 // Checa a conexão a cada segundo
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    
    // Cuida de erros de conexão depois da conexão inicial
    mongoose.connection.on('error', err => {
      console.error('MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
    });

  } catch (error) {
    console.error('Erro de conexão com MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;