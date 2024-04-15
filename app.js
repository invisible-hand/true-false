require('dotenv').config();

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(express.static('public'));
app.use(express.json());

const port = process.env.PORT || 3000;
const generatedFacts = [];

app.get('/api/fact', async (req, res) => {
  try {
    const generationConfig = {
      maxOutputTokens: 300,
      temperature: 0.9,
      topP: 0.3,
      topK: 32,
    };
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro-latest', generationConfig }, {apiVersion: 'v1beta'});

    let factObject;
    let isNewFact = false;

    while (!isNewFact) {
      const prompt = `Generate a JSON object with three properties: "fact", "isTrue", and "explain".
        The "fact" property should contain a simple statement about nature, business, engineering, music or ANY OTHER topic that can be answered with True or False.
        The "isTrue" property should be a boolean indicating whether the fact is true or false.
        The "explain" property should provide a brief explanation of 10-30 words of why the fact is true or false.
        The fact can be real or invented.
        Return the JSON object without triple backticks.
        Do not repeat any of the following facts: ${generatedFacts.map(fact => fact.fact).join(', ')}`;
      const generationResult = await model.generateContent(prompt);
      const response = await generationResult.response;
      const jsonString = await response.text();
      const cleanedJsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      factObject = JSON.parse(cleanedJsonString);
      console.log(generatedFacts.map(fact => fact.fact).join(', '));
      // Check if the generated fact is new
      if (!generatedFacts.some(fact => fact.fact === factObject.fact)) {
        isNewFact = true;
      }
    }

    generatedFacts.push(factObject);
    res.json(factObject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate fact' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});