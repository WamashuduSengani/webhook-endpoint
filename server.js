const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Webhook server is running', status: 'healthy' });
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
    const sortedCharacters = charactersArray.sort();
    

    res.json({ word: sortedCharacters });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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