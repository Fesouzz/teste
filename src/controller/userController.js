const prisma = require("../config/prisma.js");

// GET ALL (Listar ativos)
const ListarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            where: { ativo: true },
            select: { id: true, nome: true, email: true, telefone: true, endereco: true, tipo_acesso: true }
        });

        res.status(200).json({
            sucesso: true,
            total: usuarios.length,
            dados: usuarios
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao listar usuários", erro: error.message });
    }
};

// GET POR ID
const BuscarUsuarioPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ sucesso: false, mensagem: "ID inválido" });

        const usuario = await prisma.usuario.findFirst({
            where: { id: id, ativo: true },
            select: { id: true, nome: true, email: true, telefone: true, endereco: true, dt_nasc: true, tipo_acesso: true }
        });

        if (!usuario) return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });

        res.json({ sucesso: true, dados: usuario });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
};

// POST (Criar usuário)
const adicionarUsuario = async (req, res) => {
    try {
        const { nome, email, telefone, endereco, dt_nasc, senha, tipo_acesso } = req.body;

        if (!nome || !email || !telefone || !endereco || !dt_nasc || !senha) {
            return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos obrigatórios." });
        }

        // Validação preventiva: impede e-mails duplicados
        const emailExiste = await prisma.usuario.findUnique({ where: { email } });
        if (emailExiste) return res.status(400).json({ sucesso: false, mensagem: "Este e-mail já está cadastrado." });

        await prisma.usuario.create({
            data: {
                nome,
                email,
                telefone,
                endereco,
                dt_nasc: new Date(dt_nasc), // Trata a string de data para objeto Date do banco
                senha, // Dica de TCC: futuramente aplique criptografia bcrypt aqui!
                tipo_acesso: tipo_acesso || "comum"
            }
        });

        res.status(201).json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso usando Prisma!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
};

// PUT (Atualizar)
const atualizarUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nome, email, telefone, endereco } = req.body;

        if (isNaN(id)) return res.status(400).json({ sucesso: false, mensagem: "ID inválido" });

        const usuario = await prisma.usuario.findFirst({ where: { id, ativo: true } });
        if (!usuario) return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado." });

        await prisma.usuario.update({
            where: { id },
            data: { nome, email, telefone, endereco }
        });

        res.json({ sucesso: true, mensagem: "Usuário atualizado com sucesso." });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
};

// DELETE LÓGICO
const deletarUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ sucesso: false, mensagem: "ID inválido" });

        const usuario = await prisma.usuario.findFirst({ where: { id, ativo: true } });
        if (!usuario) return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado ou já removido." });

        // Realiza o soft-delete setando o ativo como false
        await prisma.usuario.update({
            where: { id },
            data: { ativo: false }
        });

        res.json({ sucesso: true, mensagem: "Usuário removido logicamente do sistema." });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
};

module.exports = { ListarUsuarios, BuscarUsuarioPorId, adicionarUsuario, atualizarUsuario, deletarUsuario };
