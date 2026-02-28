const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public')); 

app.use(express.json());
app.use(express.static('public')); 


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

app.get('/', (req, res) => {
  res.json({ message: 'Webhook server is running', status: 'healthy' });
});

app.post('/validate', (req, res) => {
  try {
    const { email, url } = req.body;
    
    if (!email || !url) {
      return res.status(400).json({ 
        error: 'Both email and URL are required',
        valid: false
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);

    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    const isUrlValid = urlRegex.test(url);

    const result = {
      email: {
        value: email,
        valid: isEmailValid,
        message: isEmailValid ? 'Valid email address' : 'Invalid email format'
      },
      url: {
        value: url,
        valid: isUrlValid,
        message: isUrlValid ? 'Valid URL format' : 'Invalid URL format'
      },
      overall: {
        valid: isEmailValid && isUrlValid,
        message: isEmailValid && isUrlValid ? 'Both email and URL are valid' : 'Validation failed'
      }
    };

    res.json(result);
    
  } catch (error) {
    console.error('Error in validation:', error);
    res.status(500).json({ error: 'Internal server error', valid: false });
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