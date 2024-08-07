import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import "dotenv/config";
import client from "./db.js";
import getUniqueNumbers from "./getUniqueNumbers.js";

const app = express();
const PORT = process.env.PORT || 80;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/words", async (req, res) => {
	const ids = getUniqueNumbers();
	const result = await client.query(
		`SELECT * FROM public.words WHERE id IN (${ids.join(", ")})`
	);
	res.json({ words: result.rows });
});

app.listen(PORT, () => {
	console.log(`Serwer działa na porcie ${PORT}`);
});
