const express = require('express');
const connectDB = require('./src/config/database');
const apiRoutes = require('./src/routes/api');
const path = require('path');

const app = express();

// Conectar MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname)));

// Routes
app.use('/api', apiRoutes);

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});