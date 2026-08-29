const express = require("express");
const path = require("path");
const cors = require("cors"); // Permite que o seu HTML converse com a API sem bloqueios de segurança
require("dotenv").config({
    path: path.resolve(__dirname, ".env")
});

const userRoutes = require("./src/routes/routes.js"); // Puxa o seu arquivo de rotas

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Ativa a liberação de acesso para o front-end
app.use(express.json());

// Endpoints principais da sua API
app.use("/users", userRoutes);

// Página inicial de teste da API
app.get("/", (req, res) => {
    res.json({
        mensagem: "API Comuna Esportes - Conectada via Pool MySQL com Sucesso!",
        status: "online"
    });
});

// Tratamento de Rota 404
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: "Rota não encontrada na API"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor do TCC rodando com sucesso na porta ${PORT}!`);
});
