import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const models = await ai.models.listModels();
        console.log(JSON.stringify(models, null, 2));
    } catch (error) {
        console.error(error);
    }
}

listModels();
