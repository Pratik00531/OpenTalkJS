//Workflow of the code :
// Flow:
// (1) User inputs via command line arguments the desired type of question (Academic, Professional, Creative).
// (2) The system randomly chooses a question from the corresponding category.
// (3) The chosen question is parsed.
// (4) The parsed question is passed to the LLM.
// (5) The LLM answers the question and stores the response.
// (6) The system displays the answer to the user.
//Functionality:
//This stage allows the user to interact with the system by choosing a specific category of questions. 
// The system then selects a random question from that category, processes it,
//  and provides the answer generated by the LLM. This demonstrates a workflow for creating a personalized question-answering experience.

import fs from 'fs';
import path from 'path';
import ollama from 'ollama';

function askOllama(question) {
  return ollama.chat({
    model: 'llama3.2:latest',
    messages: [{ role: 'user', content: question }],
  })
  .then(response => response.message ? response.message.content : null)
  .catch(error => {
    console.error('Error:', error);
    return null;
  });
}

async function processQuestionsByType(type) {
  const questionsDir = `./questions/${type}`;
  const answersDir = `./answers/${type}`;

  // Create questions directory if it doesn't exist
  if (!fs.existsSync(questionsDir)) {
    fs.mkdirSync(questionsDir, { recursive: true });
  }

  // Create answers directory if it doesn't exist
  if (!fs.existsSync(answersDir)) {
    fs.mkdirSync(answersDir, { recursive: true });
  }

  const files = fs.readdirSync(questionsDir)
    .filter(file => file.startsWith('q') && file.endsWith('.txt'))
    .sort();

  for (const file of files) {
    // Extract number from filename (e.g., "q1.txt" -> "1")
    const number = file.match(/q(\d+)\.txt/)[1];
    // Read question
    const question = fs.readFileSync(path.join(questionsDir, file), 'utf8');
    console.log(`Processing question ${number} from ${type}...`);
    const answer = await askOllama(question);
    if (answer) {
      const answerFile = `a${number}.txt`;
      fs.writeFileSync(path.join(answersDir, answerFile), answer);
      console.log(`Answer ${number} has been written to ${answerFile}`);
    } else {
      console.log(`Failed to get answer for question ${number}`);
    }
  }
}

const type = process.argv[2]; // Get the type of question from command line arguments
if (type) {
  processQuestionsByType(type)
    .then(() => {
      console.log('Processing completed');
    })
    .catch(error => {
      console.error('Processing failed:', error);
    });
} else {
  console.error('Please provide a question type (Academic, Professional, Creative)');
}