import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function testGeneration() {
  const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
  for (const modelName of models) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, are you working?");
      const text = result.response.text();
      console.log(`Success with ${modelName}: ${text.substring(0, 20)}...`);
      return;
    } catch (error) {
      console.error(`Failed with ${modelName}:`, error.message);
    }
  }
}

testGeneration();
