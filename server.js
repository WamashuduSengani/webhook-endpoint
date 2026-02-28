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

app.get('/health', (req, res) => {
  res.json({ message: 'Webhook server is running', status: 'healthy' });
});

app.post('/sort-string', (req, res) => {
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
    console.error('Error processing sort-string endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/validate', (req, res) => {
  try {
    const { email, url } = req.body;
    
    if (!email || !url) {
      return res.status(400).json({ 
        error: 'Both email and URL fields are required in request body'
      });
    }

    const supabaseUrl = `https://yhxzjyykdsfkdrmdxgho.supabase.co/functions/v1/application-task?url=${encodeURIComponent(url)}&email=${encodeURIComponent(email)}`;
    
    fetch(supabaseUrl)
      .then(response => response.json())
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        console.error('Error calling Supabase function:', error);
        res.status(500).json({ error: 'Failed to validate with external service' });
      });
    
  } catch (error) {
    console.error('Error in validate:', error);
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
  console.log(`Sort endpoint available at: http://localhost:${PORT}/sort-string`);
});

module.exports = app;