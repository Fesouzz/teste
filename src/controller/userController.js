const db = require("../config/pool.js"); // Garanta que o caminho aponta para o seu arquivo de Pool do mysql2

// =========================================================================
// 1. LISTAR TODOS OS USUÁRIOS ATIVOS (GET)
// =========================================================================
const ListarUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, nome, email, telefone, endereco, tipo_acesso FROM cadusers WHERE ativo = true"
        );
        res.status(200).json({
            sucesso: true,
            total: rows.length,
            dados: rows
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao listar usuários", erro: error.message });
    }
};

// =========================================================================
// 2. CADASTRAR NOVO USUÁRIO (POST)
// =========================================================================
const adicionarUsuario = async (req, res) => {
    try {
        const { nome, email, telefone, endereco, dt_nasc, senha, tipo_acesso } = req.body;

        if (!nome || !email || !telefone || !endereco || !dt_nasc || !senha) {
            return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos obrigatórios." });
        }

        // Evita e-mails duplicados no banco
        const [usuarios] = await db.query("SELECT id FROM cadusers WHERE email = ?", [email]);
        if (usuarios.length > 0) {
            return res.status(400).json({ sucesso: false, mensagem: "Este e-mail já está cadastrado." });
        }

        await db.query(
            "INSERT INTO cadusers (nome, email, telefone, endereco, dt_nasc, senha, tipo_acesso) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nome, email, telefone, endereco, dt_nasc, senha, tipo_acesso || 'comum']
        );

        res.status(201).json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso via Pool!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
};

// =========================================================================
// 3. EFETUAR AUTENTICAÇÃO / LOGIN (POST - O bloco que você colou!)
// =========================================================================
const efetuarLogin = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ sucesso: false, mensagem: "E-mail e senha são obrigatórios." });
        }

        // Busca na tabela 'cadusers' que criamos no seu MySQL
        const [linhas] = await db.query(
            "SELECT id, nome, email, senha, tipo_acesso FROM cadusers WHERE email = ? AND ativo = TRUE", 
            [email]
        );

        if (linhas.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado ou inativo." });
        }

        const usuario = linhas[0];

        if (usuario.senha !== senha) {
            return res.status(401).json({ sucesso: false, mensagem: "Senha incorreta." });
        }

        res.status(200).json({
            sucesso: true,
            mensagem: "Autenticação efetuada com sucesso!",
            dados: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo_acesso: usuario.tipo_acesso
            }
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro interno de autenticação", erro: error.message });
    }
};

// Exporta as três funções juntas para o arquivo de rotas ler
module.exports = {
    ListarUsuarios,
    adicionarUsuario,
    efetuarLogin
};
