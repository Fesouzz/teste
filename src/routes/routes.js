const express = require("express");
const router = express.Router();

// Importação dos controladores separados
const userController = require("../controller/userController");
const projetoController = require("../controller/projetoController");
const authController = require("../controller/authController");

// --- ROTAS DE USUÁRIOS ---
router.get("/users", userController.ListarUsuarios);
router.get("/users/:id", userController.BuscarUsuarioPorId);
router.post("/users", userController.adicionarUsuario);
router.put("/users/:id", userController.atualizarUsuario);
router.delete("/users/:id", userController.deletarUsuario);

// --- ROTAS DE PROJETOS ---
router.get("/projetos", projetoController.listarProjetos);
router.post("/projetos", projetoController.cadastrarProjeto);

// --- ROTA DE AUTENTICAÇÃO (LOGIN) ---
router.post("/login", authController.efetuarLogin);

module.exports = router;
