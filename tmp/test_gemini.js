import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBmBWTon6_dk8PUS-ZmFQyk2rdb2qr5AL4";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Merhaba");
        const response = await result.response;
        console.log(response.text());
    } catch (e) {
        console.error("Error with gemini-1.5-flash", e.message);
    }
}

run();
