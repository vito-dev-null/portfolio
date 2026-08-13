// Simple Express proxy to forward chat messages to OpenAI
// Usage:
// 1) npm init -y
// 2) npm install express cors dotenv
// 3) set OPENAI_API_KEY in environment or create a .env file with OPENAI_API_KEY=your_key
// 4) node server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if(!OPENAI_API_KEY){
  console.warn('Warning: OPENAI_API_KEY is not set. Set it in your environment or .env file.');
}

app.post('/api/ai', async (req, res) => {
  try{
    const { message, history } = req.body || {};
    if(!message) return res.status(400).json({ error: 'No message provided' });

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Sei un assistente utile e conciso. Rispondi in italiano quando possibile.' },
        ...(Array.isArray(history) ? history : []),
        { role: 'user', content: message }
      ],
      max_tokens: 800,
      temperature: 0.2
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if(!r.ok){
      const errText = await r.text();
      console.error('OpenAI error', r.status, errText);
      return res.status(502).json({ error: 'OpenAI API error', detail: errText });
    }

    const data = await r.json();
    const reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    res.json({ reply });
  }catch(err){
    console.error('Proxy error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`AI proxy listening on http://localhost:${port}`));
