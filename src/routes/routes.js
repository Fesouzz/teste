const express = require("express");
const router = express.Router();

// Importação correta dos dois controladores limpos do Pool MySQL
const userController = require("../controller/userController");
const projetoController = require("../controller/projetoController");

// =========================================================================
// 👥 ROTAS DE USUÁRIOS E LOGIN (Vêm do userController)
// =========================================================================
router.get("/users", userController.ListarUsuarios);
router.post("/users", userController.adicionarUsuario);
router.post("/login", userController.efetuarLogin);

// =========================================================================
// 🏢 ROTAS DE PROJETOS E SOLICITAÇÕES (Vêm do projetoController)
// =========================================================================
// --- ROTAS DE PROJETOS ---
router.get("/projetos", projetoController.listarProjetos);
router.post("/projetos", projetoController.cadastrarProjeto);
router.delete("/projetos/:id", projetoController.deletarProjeto);
router.put("/projetos/:id/decisao", projetoController.decidirProposta); // <-- GARANTA QUE ESSA LINHA ESTÁ EXATAMENTE ASSIM!

module.exports = router;


