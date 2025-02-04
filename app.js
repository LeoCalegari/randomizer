const express = require('express');
const connectDB = require('./src/config/database');
const apiRoutes = require('./src/routes/api');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Conecta ao MongoDB
connectDB();

// Middleware
app.use(express.json());

// Rotas
app.use('/api/v1', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Checagem de conexão com o banco
function checkDBConnection() {
  console.clear()
  console.log(`Server running on port ${PORT}`);
  
  const state = mongoose.connection.readyState;
  let status;
  switch (state) {
    case 0:
      status = 'disconnected';
      break;
    case 1:
      status = 'connected';
      break;
    case 2:
      status = 'connecting';
      break;
    case 3:
      status = 'disconnecting';
      break;
    default:
      status = 'unknown';
  }
  console.log(`Status do banco de dados: ${status} - ${new Date().toLocaleTimeString()}`);
}

setInterval(checkDBConnection, 60000);