const mysql = require("mysql2/promise");

// Configura o Pool de conexões usando as variáveis do seu arquivo .env
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "sua_senha_do_mysql",
    database: process.env.DB_NAME || "comuna",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
