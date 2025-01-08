import ollama from 'ollama';
import fs from 'fs';
import path from 'path';

// Workflow of the code:
// Questions(directory): A set of questions are stored in text files (e.g., q1.txt, q2.txt). It should make directory if it doesn't exist
// READ: A script or application (app.js) reads these questions from the file system (fs).
// PASS QUESTION: The questions are passed to the LLM, by using Ollama model.
// LLM: The LLM processes the questions and generates responses.
// store response: The LLM's responses are stored in text files making directory of answers and storing the answers files (e.g., a1.txt, a2.txt). Should create directory if it doesn't exist

function askOllama(question) {
  return ollama.chat({
    model: 'llama3.2:latest',
    messages: [{ role: 'user', content: question }],
  })
  .then(response => response.message.content)
  .catch(error => {
    console.error('Error:', error);
    return null;
  });
}

async function processBatchQuestions() {
  const questionsDir = './questions';
  const answersDir = './answers';

  // Create questions directory if it doesn't exist
  if (!fs.existsSync(questionsDir)) {
    fs.mkdirSync(questionsDir);
  }

  // Create answers directory if it doesn't exist
  if (!fs.existsSync(answersDir)) {
    fs.mkdirSync(answersDir);
  }

  const files = fs.readdirSync(questionsDir)
    .filter(file => file.startsWith('q') && file.endsWith('.txt'))
    .sort();

  for (const file of files) {
    // Extract number from filename (e.g., "q1.txt" -> "1")
    const number = file.match(/q(\d+)\.txt/)[1];
    // Read question
    const question = fs.readFileSync(path.join(questionsDir, file), 'utf8');
    console.log(`Processing question ${number}...`);
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

processBatchQuestions()
  .then(() => {
    console.log('Batch processing completed');
  })
  .catch(error => {
    console.error('Batch processing failed:', error);
  });