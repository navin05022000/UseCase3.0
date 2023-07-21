
import { createInterface } from 'readline';
import { writeFile, readFile } from 'fs';
import fetch from 'node-fetch';

// Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
const apiKey = "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";
const endpoint = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

// Function to read user input and create input.txt file
function createInputFile() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter your input text: ', (inputText) => {
    writeFile('input.txt', inputText, (err) => {
      if (err) {
        console.error('Error creating input.txt:', err);
      } else {
        console.log('input.txt has been created successfully!');
        rl.close();
        processFile();
      }
    });
  });
}

// Function to process the input.txt file and create output.txt
function processFile() {
  readFile('input.txt', 'utf8', (err, inputText) => {
    if (err) {
      console.error('Error reading input.txt:', err);
    } else {
      // Call the OpenAI API to process the inputText and generate output
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: inputText,
          max_tokens: 150, // You can adjust this value based on your desired output length
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        const outputText = data.choices[0].text;
        writeFile('output.txt', outputText, (err) => {
          if (err) {
            console.error('Error creating output.txt:', err);
          } else {
            console.log('output.txt has been created successfully!');
          }
        });
      })
      .catch((error) => {
        console.error('Error processing input with OpenAI API:', error);
      });
    }
  });
}

createInputFile();

