import dotenv from "dotenv";

dotenv.config();

async function testFetch() {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  console.log(`Using Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);
  
  const versions = ["v1", "v1beta"];
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  
  for (const v of versions) {
    for (const m of models) {
      const url = `https://generativelanguage.googleapis.com/${v}/models/${m}:generateContent?key=${apiKey}`;
      try {
        console.log(`Testing ${v}/${m}...`);
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
        });
        const data = await res.json();
        if (res.ok) {
          console.log(`  SUCCESS!`);
        } else {
          console.log(`  FAILED: ${res.status} - ${data.error?.message || JSON.stringify(data)}`);
        }
      } catch (e: any) {
        console.log(`  ERROR: ${e.message}`);
      }
    }
  }
}

testFetch();
