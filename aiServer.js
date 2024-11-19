const express = require('express');
const fetch = require('node-fetch');  // Using node-fetch version 2.x
const cors = require('cors');  // Import the CORS package
require('dotenv').config();  // To load environment variables from .env file
const app = express();
const port = 5000;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());  // Allow cross-origin requests

// Endpoint to handle OpenAI requests
app.post('/api/ask-openai', async (req, res) => {
    const { question } = req.body;

    try {
        // Send request to OpenAI with the correct endpoint and headers
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,  // Use environment variable for API key
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',  // Or 'gpt-4' if you're using GPT-4
                messages: [
                    { role: 'user', content: question },  // User's question
                ],
                max_tokens: 150,  // Adjust token limit as needed
            }),
        });

        const data = await response.json();

        // Check if the response is successful
        if (!response.ok) {
            console.error('Error Response:', data);  // Log the error response for debugging
            return res.status(response.status).json({ error: `OpenAI API Error: ${data.error.message}` });
        }

        // Send back OpenAI's response
        res.json({ answer: data.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error with OpenAI request:', error);
        res.status(500).json({ error: `Failed to get OpenAI response: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
