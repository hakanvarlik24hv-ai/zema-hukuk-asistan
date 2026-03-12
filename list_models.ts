import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    // Note: The SDK might not have a direct listModels, but we can try the REST API via fetch if needed
    // Actually, checking the models is easiest via a direct fetch to the URL
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Available Models:");
    if (data.models) {
      data.models.forEach((m: any) => {
        console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods.join(", ")})`);
      });
    } else {
      console.log("No models found or error:", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
