import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT, 10),
});

(async () => {
	try {
		await client.connect();
		console.log("connection with database started");
		const result = await client.query("SELECT current_user");
		console.log("current db user:", result.rows[0].current_user);
	} catch (err) {
		console.error("error:", err.stack);
	}
})();

export default client;
