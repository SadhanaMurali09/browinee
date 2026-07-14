const express = require('express');
const path = require('path');
const apiRoutes = require('./routes');
const { initializeDatabase } = require('./backend/config/db');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.sendStatus(204);
});

app.use('/api', apiRoutes);
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

async function startServer(port, attempts = 0) {
  try {
    await initializeDatabase();
  } catch (error) {
    console.warn('Database initialization skipped:', error.message);
  }

  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts < 10) {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1, attempts + 1);
      return;
    }

    console.error(err);
    process.exit(1);
  });
}

startServer(PORT);
