const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.post('/webhook', (req, res) => {
  try {
    if (!req.body || typeof req.body.data !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request. Expected JSON with a "data" field containing a string.' 
      });
    }

    const inputString = req.body.data;
    const charactersArray = inputString.split('');


    res.json({ word: charactersArray });
    
  } catch (error) {
    console.error('Error processing webhook endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(express.static('public'));

app.use((error, req, res, next) => {
  console.error('Unexpected error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Webhook endpoint available at: http://localhost:${PORT}/webhook`);
});

module.exports = app;