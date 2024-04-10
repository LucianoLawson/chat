const express = require('express');
import axios from 'axios';
const app = express();
app.use(express.json());

const REACT_APP_OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: "text-davinci-003",
      prompt: userMessage,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${REACT_APP_OPENAI_API_KEY}`
      }
    });
    res.json({ message: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Failed to fetch AI response:', error);
    res.status(500).send('Something went wrong.');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
