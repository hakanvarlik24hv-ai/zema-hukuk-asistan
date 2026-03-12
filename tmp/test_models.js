import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBmBWTon6_dk8PUS-ZmFQyk2rdb2qr5AL4";
const ai = new GoogleGenerativeAI(apiKey);

async function test() {
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-flash-latest"];
    let lastError = null;

    for (const modelName of models) {
        console.log(`Trying ${modelName}...`);
        try {
            const model = ai.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Merhaba, nasılsın?");
            const response = await result.response;
            console.log(`Success with ${modelName}:`, await response.text().substring(0, 50));
            return;
        } catch (err) {
            console.error(`Error with ${modelName}:`, err.message);
            lastError = err;
        }
    }
}

test();
