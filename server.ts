import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("hukuk.db");
const aiKey = (process.env.GEMINI_API_KEY || "").trim();
const ai = new GoogleGenerativeAI(aiKey);
console.log(`[AI] Initialized with key starting with: ${aiKey.substring(0, 5)}... (Length: ${aiKey.length})`);

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT CHECK(role IN ('lawyer', 'client')) DEFAULT 'lawyer'
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lawyer_id INTEGER,
    name TEXT,
    email TEXT,
    phone TEXT,
    FOREIGN KEY(lawyer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lawyer_id INTEGER,
    client_id INTEGER,
    title TEXT,
    case_number TEXT,
    court TEXT,
    status TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lawyer_id) REFERENCES users(id),
    FOREIGN KEY(client_id) REFERENCES clients(id)
  );

  CREATE TABLE IF NOT EXISTS hearings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER,
    hearing_date DATETIME,
    location TEXT,
    notes TEXT,
    FOREIGN KEY(case_id) REFERENCES cases(id)
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER,
    title TEXT,
    content TEXT,
    type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER,
    amount REAL,
    status TEXT,
    due_date DATETIME,
    FOREIGN KEY(case_id) REFERENCES cases(id)
  );
`);

// Seed initial user
const adminEmail = "yonetim@zemahukuk.com.tr";
const adminPass = "zema2024";
const seedUser = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail);
if (!seedUser) {
  db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(
    adminEmail,
    adminPass,
    "Av. Mahmut KORKMAZ\nAv. Zeki FIRAT",
    "lawyer"
  );
} else {
  // Always ensure the name and password are correct
  db.prepare("UPDATE users SET password = ?, name = ? WHERE email = ?").run(
    adminPass, 
    "Av. Mahmut KORKMAZ\nAv. Zeki FIRAT", 
    adminEmail
  );
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Logger middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Configure CORS - Extremely permissive for debugging
  app.use(cors());

  app.use(express.json());

  let currentUser: any = null;

  const requireAuth = (req: any, res: any, next: any) => {
    // If not logged in, but we have a secret "auto-login" header or similar, we could handle it.
    // For now, if currentUser is null, we check the db for the default user as a fallback
    // to make it "stay logged in" for this specific use case.
    if (!currentUser) {
      currentUser = db.prepare("SELECT * FROM users WHERE email = ?").get("yonetim@zemahukuk.com.tr");
    }
    next();
  };

  // API Routes
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE password = ?").get(password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      currentUser = userWithoutPassword;
      res.json(currentUser);
    } else {
      res.status(401).json({ error: "Hatalı şifre." });
    }
  });

  app.post("/api/logout", (req, res) => { currentUser = null; res.json({ success: true }); });
  app.get("/api/me", (req, res) => res.json(currentUser || null));

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      database: "connected",
      ai_configured: !!process.env.GEMINI_API_KEY,
      node_env: process.env.NODE_ENV || "unknown",
      version: "1.0.5 - Experimental Models"
    });
  });

  app.get("/api/dashboard", requireAuth, (req, res) => {
    const stats = {
      activeCases: db.prepare("SELECT COUNT(*) as count FROM cases WHERE status = 'Aktif'").get().count,
      upcomingHearings: db.prepare("SELECT COUNT(*) as count FROM hearings WHERE hearing_date > datetime('now')").get().count,
      totalClients: db.prepare("SELECT COUNT(*) as count FROM clients").get().count,
      pendingPayments: db.prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'Bekliyor'").get().count,
    };
    res.json(stats);
  });

  app.get("/api/clients", requireAuth, (req, res) => {
    res.json(db.prepare("SELECT * FROM clients").all());
  });

  app.post("/api/clients", requireAuth, (req, res) => {
    const { name, email, phone } = req.body;
    const result = db.prepare("INSERT INTO clients (lawyer_id, name, email, phone) VALUES (?, ?, ?, ?)").run(currentUser.id, name, email, phone);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/cases", requireAuth, (req, res) => {
    res.json(db.prepare("SELECT cases.*, clients.name as client_name FROM cases JOIN clients ON cases.client_id = clients.id").all());
  });

  app.get("/api/hearings", requireAuth, (req, res) => {
    res.json(db.prepare("SELECT hearings.*, cases.title as case_title FROM hearings JOIN cases ON hearings.case_id = cases.id ORDER BY hearing_date ASC").all());
  });

  const callAI = async (prompt: string, isJson: boolean = false) => {
    const models = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
    let lastError: any = null;

    for (const modelName of models) {
      try {
        const generationConfig: any = {};
        if (isJson) generationConfig.responseMimeType = "application/json";

        const model = ai.getGenerativeModel({ model: modelName, generationConfig });
        console.log(`[AI] Attempting generation with model: ${modelName}`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          console.log(`[AI] Success with model: ${modelName}`);
          return text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = (err.message || "").toLowerCase();
        console.error(`AI Error with ${modelName}:`, errMsg);
        
        // Retry on 429 (quota), 503 (overload), or 404 (model not found)
        if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("overloaded") || errMsg.includes("not found") || errMsg.includes("404")) {
          continue;
        }
        throw err;
      }
    }
    console.error("All AI models failed. Last error:", lastError);
    throw lastError;
  };

  app.post("/api/ai/petition", requireAuth, async (req, res) => {
    const { caseType, parties, summary, documentType } = req.body;
    const prompt = `Türkiye hukuk sistemine uygun bir ${documentType} oluştur. Dava Türü: ${caseType}. Taraf Bilgileri: ${parties}. Olay Özeti: ${summary}. Profesyonel avukat diliyle hazırlayın.`;
    try {
      const text = await callAI(prompt);
      res.json({ text });
    } catch (err: any) {
      console.error("AI Petition Error:", err);
      const msg = err.message?.includes("429") ? "API Kullanım limiti doldu. Lütfen 1 dakika bekleyin." : `Yapay zeka yanıt vermedi. (Detay: ${err.message || 'Bilinmeyen hata'})`;
      res.status(500).json({ error: msg });
    }
  });

  app.post("/api/ai/analyze", requireAuth, async (req, res) => {
    const { content } = req.body;
    const prompt = `Aşağıdaki metni analiz et: ${content}. JSON: { "missingPoints": [], "risks": [], "suggestions": [], "laws": [] }`;
    try {
      const text = await callAI(prompt, true);
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("AI Analyze Error:", err);
      res.status(500).json({ error: `Analiz hatası: ${err.message}` });
    }
  });

  app.post("/api/ai/precedents", requireAuth, async (req, res) => {
    const { query } = req.body;
    const prompt = `"${query}" konusuyla ilgili emsal kararlar. JSON [{ "court": "", "number": "", "summary": "", "principle": "" }]`;
    try {
      const text = await callAI(prompt, true);
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("AI Precedents Error:", err);
      res.status(500).json({ error: `Arama hatası: ${err.message}` });
    }
  });

  app.post("/api/ai/contract", requireAuth, async (req, res) => {
    const { contractType, details } = req.body;
    const prompt = `${contractType} oluştur. Detaylar: ${details}. Tam metin.`;
    try {
      const text = await callAI(prompt);
      res.json({ text });
    } catch (err: any) {
      console.error("AI Contract Error:", err);
      res.status(500).json({ error: `Sözleşme hatası: ${err.message}` });
    }
  });

  // Handle errors and non-matches for API
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API Route Not Found" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    // Only serve static files if NOT on Railway (where we only want API)
    // Or if Railway IS supposed to serve the frontend. 
    // Given the user is using Firebase, we probably don't need this on Railway.
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
