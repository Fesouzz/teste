const prisma = require("../config/prisma.js");

// POST - Validar Acesso ao Portal
const efetuarLogin = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ sucesso: false, mensagem: "E-mail e senha são obrigatórios." });
        }

        // Busca o usuário ativo no banco de dados através do e-mail informado
        const usuario = await prisma.usuario.findFirst({
            where: {
                email: email,
                ativo: true
            }
        });

        // Se o usuário não existir
        if (!usuario) {
            return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado ou inativo." });
        }

        // Validação da senha simples (Alinhado com a sua base atual)
        if (usuario.senha !== senha) {
            return res.status(401).json({ sucesso: false, mensagem: "Senha incorreta." });
        }

        // Sucesso: Retorna os dados e diz ao Front se ele é Administrador ou Comum
        res.status(200).json({
            sucesso: true,
            mensagem: "Autenticação efetuada com sucesso!",
            dados: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo_acesso: usuario.tipo_acesso // Retorna 'admin' ou 'comum'
            }
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro interno de autenticação", erro: error.message });
    }
};

module.exports = {
    efetuarLogin
};
