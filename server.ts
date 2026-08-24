import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// MySQL Connection Pool
const pool = mysql.createPool({
  host: "95.217.181.123",
  user: "briefinglançament6o",
  password: "xMGi2CbDiAXCyGEd",
  database: "briefinglançament6o",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000, // Fail faster if DB is unreachable
});

async function initDB() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS briefing_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255),
        contact_name VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(255),
        responses_json JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log("Database initialized successfully.");
  } catch (err: any) {
    console.log("Database initialization skipped due to connection timeout.");
  }
}

initDB();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route to submit form
  app.post("/api/submit-briefing", async (req, res) => {
    try {
      const data = req.body;
      
      const {
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        ...rest
      } = data;

      const responsesJson = JSON.stringify(rest);
      let dbSuccess = false;
      let sheetSuccess = false;

      // 1. Try to save to Google Sheets webhook first
      if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
        try {
          const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            sheetSuccess = true;
          }
        } catch (webhookErr) {
          console.error("Failed to send data to Google Sheets webhook:", webhookErr);
        }
      }

      // 2. Try to save to MySQL
      try {
        await pool.query(
          `INSERT INTO briefing_responses 
          (company_name, contact_name, contact_email, contact_phone, responses_json) 
          VALUES (?, ?, ?, ?, ?)`,
          [companyName, contactName, contactEmail, contactPhone, responsesJson]
        );
        dbSuccess = true;
      } catch (dbErr: any) {
        console.log("Database connection timeout during save.");
      }

      if (!dbSuccess && !sheetSuccess && !process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
        return res.status(500).json({ success: false, message: "A conexão com o banco de dados falhou e nenhum webhook do Google Sheets foi configurado." });
      }

      res.status(200).json({ success: true, message: "Briefing submitted successfully!" });
    } catch (err) {
      console.error("Unexpected error saving briefing:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  // API Route to fetch all briefings (for admin view)
  app.get("/api/briefings", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM briefing_responses ORDER BY created_at DESC");
      res.status(200).json(rows);
    } catch (err: any) {
      console.log("Database connection timeout when fetching briefings. Returning empty list.");
      // Return empty array instead of 500 so UI doesn't break, and user can still see Sheets instructions
      res.status(200).json([]);
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
