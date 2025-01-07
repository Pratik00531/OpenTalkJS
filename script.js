import fs from "fs";
import ollama from "ollama";

let q = fs.readFileSync("a.txt");
q = q.toString();

async function runChat() {
  try {
    const response = await ollama.chat({
      model: "llama3.2:latest",
      messages: [{ role: 'user', content: q}]
    });

    let message = response.message.content;
    console.log("Chatbot Response:", message);
    fs.writeFileSync('a.txt', message.toString());

  } catch (error) {
    console.error("Error occurred:", error.message);
  }
}

runChat();